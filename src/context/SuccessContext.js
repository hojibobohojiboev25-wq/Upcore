import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import * as Haptics from 'expo-haptics';
import { getPastDays, isSameDay, startOfDay } from '../utils/date';
import { loadState, saveState } from '../storage/storage';
import { getPalette } from '../constants/theme';
import { translations } from '../i18n/translations';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail
} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  cancelTaskReminder,
  requestNotificationPermission,
  scheduleTaskReminder,
  setupNotifications
} from '../services/notifications';
import { generateAiChatReply } from '../services/aiCoach';
import { auth, db, storage } from '../services/firebase';

const SuccessContext = createContext(null);

const initialState = {
  loaded: false,
  profile: {
    ownerUid: '',
    name: '',
    mission: '',
    age: '',
    city: '',
    profession: '',
    photoURL: '',
    followersCount: 0,
    followingCount: 0,
    ready: false
  },
  tasks: [],
  goals: [],
  settings: {
    theme: 'dark',
    language: 'ru',
    notificationsEnabled: false,
    dailyTaskTarget: 3,
    compactMode: false,
    weeklyInsights: true,
    hapticsEnabled: true,
    twentyFourHour: true,
    reminderMinutes: 20,
    weekStartsOn: 'monday',
    defaultPriority: 'medium',
    showGuide: true,
    trackingAccess: false
  },
  trackedApps: [],
  meta: {
    lastActivityAt: null
  }
};

const actionTypes = {
  HYDRATE: 'HYDRATE',
  ADD_TASK: 'ADD_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
  REMOVE_TASK: 'REMOVE_TASK',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  REMOVE_GOAL: 'REMOVE_GOAL',
  SET_DAILY_TARGET: 'SET_DAILY_TARGET',
  SET_PROFILE: 'SET_PROFILE',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_TASK_NOTIFICATION: 'SET_TASK_NOTIFICATION',
  CLEAR_COMPLETED_TASKS: 'CLEAR_COMPLETED_TASKS',
  ADD_TRACKED_APP: 'ADD_TRACKED_APP',
  START_TRACKED_APP: 'START_TRACKED_APP',
  STOP_TRACKED_APP: 'STOP_TRACKED_APP',
  REMOVE_TRACKED_APP: 'REMOVE_TRACKED_APP'
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.HYDRATE:
      return {
        ...state,
        ...action.payload,
        profile: {
          ...state.profile,
          ...(action.payload?.profile || {})
        },
        settings: {
          ...state.settings,
          ...(action.payload?.settings || {})
        },
        trackedApps: action.payload?.trackedApps || [],
        loaded: true
      };
    case actionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        meta: { lastActivityAt: new Date().toISOString() }
      };
    case actionTypes.SET_TASK_NOTIFICATION:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, notificationId: action.payload.notificationId }
            : task
        )
      };
    case actionTypes.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id !== action.payload.id) return task;
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : null
          };
        }),
        meta: { lastActivityAt: new Date().toISOString() }
      };
    case actionTypes.REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id)
      };
    case actionTypes.ADD_GOAL:
      return {
        ...state,
        goals: [action.payload, ...state.goals],
        meta: { lastActivityAt: new Date().toISOString() }
      };
    case actionTypes.UPDATE_GOAL:
      return {
        ...state,
        goals: state.goals.map((goal) => {
          if (goal.id !== action.payload.id) return goal;
          const nextCurrent = Math.max(
            0,
            Math.min(goal.target, goal.current + action.payload.delta)
          );
          return { ...goal, current: nextCurrent };
        }),
        meta: { lastActivityAt: new Date().toISOString() }
      };
    case actionTypes.REMOVE_GOAL:
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload.id)
      };
    case actionTypes.SET_DAILY_TARGET:
      return {
        ...state,
        settings: {
          ...state.settings,
          dailyTaskTarget: Math.max(1, Number(action.payload.value) || 1)
        }
      };
    case actionTypes.SET_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        }
      };
    case actionTypes.SET_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    case actionTypes.CLEAR_COMPLETED_TASKS:
      return {
        ...state,
        tasks: state.tasks.filter((task) => !task.completed)
      };
    case actionTypes.ADD_TRACKED_APP:
      return {
        ...state,
        trackedApps: [action.payload, ...state.trackedApps]
      };
    case actionTypes.START_TRACKED_APP:
      return {
        ...state,
        trackedApps: state.trackedApps.map((app) => {
          if (app.id !== action.payload.id || app.isRunning) return app;
          return {
            ...app,
            isRunning: true,
            lastStartedAt: action.payload.startedAt,
            openCount: (app.openCount || 0) + 1
          };
        })
      };
    case actionTypes.STOP_TRACKED_APP:
      return {
        ...state,
        trackedApps: state.trackedApps.map((app) => {
          if (app.id !== action.payload.id || !app.isRunning || !app.lastStartedAt) return app;
          const startedAtMs = new Date(app.lastStartedAt).getTime();
          const endedAtMs = new Date(action.payload.endedAt).getTime();
          if (Number.isNaN(startedAtMs) || Number.isNaN(endedAtMs) || endedAtMs <= startedAtMs) {
            return {
              ...app,
              isRunning: false,
              lastStartedAt: null
            };
          }
          const durationSec = Math.max(1, Math.floor((endedAtMs - startedAtMs) / 1000));
          return {
            ...app,
            isRunning: false,
            lastStartedAt: null,
            totalSeconds: (app.totalSeconds || 0) + durationSec,
            sessions: [
              ...(app.sessions || []),
              {
                startedAt: app.lastStartedAt,
                endedAt: action.payload.endedAt,
                durationSec
              }
            ]
          };
        })
      };
    case actionTypes.REMOVE_TRACKED_APP:
      return {
        ...state,
        trackedApps: state.trackedApps.filter((app) => app.id !== action.payload.id)
      };
    default:
      return state;
  }
};

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
const createRoomId = (uidA, uidB) => [uidA, uidB].sort().join('_');

export const SuccessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      await setupNotifications();
      const persisted = await loadState();
      if (persisted) {
        dispatch({ type: actionTypes.HYDRATE, payload: persisted });
      } else {
        dispatch({ type: actionTypes.HYDRATE, payload: initialState });
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user || null);
      setAuthReady(true);
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const existing = await getDoc(userRef);
      if (!existing.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          mission: '',
          age: '',
          city: '',
          profession: '',
          photoURL: user.photoURL || '',
          followers: [],
          following: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      const latest = existing.exists() ? existing.data() : null;
      dispatch({
        type: actionTypes.SET_PROFILE,
        payload: {
          ownerUid: user.uid,
          name: latest?.displayName || user.displayName || '',
          mission: latest?.mission || '',
          age: latest?.age || '',
          city: latest?.city || '',
          profession: latest?.profession || '',
          photoURL: latest?.photoURL || user.photoURL || '',
          followersCount: Array.isArray(latest?.followers) ? latest.followers.length : 0,
          followingCount: Array.isArray(latest?.following) ? latest.following.length : 0,
          ready: Boolean(latest?.displayName || user.displayName)
        }
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!state.loaded) return;
    saveState({
      profile: state.profile,
      tasks: state.tasks,
      goals: state.goals,
      settings: state.settings,
      trackedApps: state.trackedApps,
      meta: state.meta
    });
  }, [state]);

  useEffect(() => {
    if (!state.loaded || !state.settings.notificationsEnabled) return;
    requestNotificationPermission();
  }, [state.loaded, state.settings.notificationsEnabled]);

  const metrics = useMemo(() => {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter((t) => t.completed).length;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const goalsCompleted = state.goals.filter((g) => g.current >= g.target).length;

    const todaysCompleted = state.tasks.filter(
      (task) => task.completed && task.completedAt && isSameDay(task.completedAt, new Date())
    ).length;
    const todayTargetPercent = Math.min(
      100,
      Math.round((todaysCompleted / Math.max(1, state.settings.dailyTaskTarget)) * 100)
    );

    const last7days = getPastDays(7).map((day) => {
      const dayDone = state.tasks.filter(
        (task) => task.completed && task.completedAt && isSameDay(task.completedAt, day)
      ).length;
      return { date: day, done: dayDone };
    });

    const doneDays = state.tasks
      .filter((task) => task.completedAt)
      .map((task) => startOfDay(task.completedAt).getTime());
    const uniqueDoneDays = [...new Set(doneDays)].sort((a, b) => b - a);
    const cursor = startOfDay(new Date()).getTime();
    let streak = 0;

    for (let i = 0; i < 365; i += 1) {
      const expectedDay = cursor - i * 24 * 60 * 60 * 1000;
      if (uniqueDoneDays.includes(expectedDay)) {
        streak += 1;
      } else {
        if (i === 0) continue;
        break;
      }
    }

    return {
      totalTasks,
      completedTasks,
      completionRate,
      goalsCompleted,
      last7days,
      streak,
      todaysCompleted,
      dailyTaskTarget: state.settings.dailyTaskTarget,
      todayTargetPercent,
      productivityScore: Math.min(
        100,
        Math.round(completionRate * 0.55 + Math.min(40, streak * 5) + Math.min(20, goalsCompleted * 8))
      )
    };
  }, [state.goals, state.settings.dailyTaskTarget, state.tasks]);

  const addTask = useCallback(
    async ({ title, priority, note, dueAt }) => {
      const id = createId();
      const payload = {
        id,
        title,
        note,
        dueAt: dueAt || null,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        notificationId: null
      };
      dispatch({ type: actionTypes.ADD_TASK, payload });

      if (!dueAt || !state.settings.notificationsEnabled) return;
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;
      const notificationId = await scheduleTaskReminder({
        taskTitle: title,
        dueAtISO: dueAt,
        minutesBefore: state.settings.reminderMinutes
      });
      if (notificationId) {
        dispatch({
          type: actionTypes.SET_TASK_NOTIFICATION,
          payload: { id, notificationId }
        });
      }
    },
    [state.settings.notificationsEnabled, state.settings.reminderMinutes]
  );

  const toggleTask = useCallback(
    async (id) => {
      const task = state.tasks.find((item) => item.id === id);
      if (task?.notificationId && !task.completed) {
        await cancelTaskReminder(task.notificationId);
      }
      dispatch({ type: actionTypes.TOGGLE_TASK, payload: { id } });
    },
    [state.tasks]
  );

  const removeTask = useCallback(
    async (id) => {
      const task = state.tasks.find((item) => item.id === id);
      if (task?.notificationId) {
        await cancelTaskReminder(task.notificationId);
      }
      dispatch({ type: actionTypes.REMOVE_TASK, payload: { id } });
    },
    [state.tasks]
  );

  const addGoal = useCallback(({ title, target, period }) => {
    const payload = {
      id: createId(),
      title,
      target: Math.max(1, Number(target) || 1),
      current: 0,
      period: period || 'monthly',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: actionTypes.ADD_GOAL, payload });
  }, []);

  const updateGoal = useCallback((id, delta) => {
    dispatch({
      type: actionTypes.UPDATE_GOAL,
      payload: { id, delta }
    });
  }, []);

  const removeGoal = useCallback((id) => {
    dispatch({ type: actionTypes.REMOVE_GOAL, payload: { id } });
  }, []);

  const setDailyTaskTarget = useCallback((value) => {
    dispatch({
      type: actionTypes.SET_DAILY_TARGET,
      payload: { value }
    });
  }, []);

  const setProfile = useCallback(
    async (profileData) => {
      const payload = {
        ...profileData,
        ownerUid: authUser?.uid || state.profile.ownerUid,
        ready: true
      };
      dispatch({
        type: actionTypes.SET_PROFILE,
        payload
      });
      if (auth.currentUser && payload.name?.trim()) {
        await updateProfile(auth.currentUser, { displayName: payload.name.trim() });
      }
      if (authUser?.uid) {
        await setDoc(
          doc(db, 'users', authUser.uid),
          {
            uid: authUser.uid,
            email: authUser.email || '',
            displayName: payload.name || authUser.displayName || '',
            mission: payload.mission || '',
            age: payload.age || '',
            city: payload.city || '',
            profession: payload.profession || '',
            photoURL: payload.photoURL || authUser.photoURL || '',
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      }
    },
    [authUser, state.profile.ownerUid]
  );

  const updateSettings = useCallback((settingsPatch) => {
    dispatch({
      type: actionTypes.SET_SETTINGS,
      payload: settingsPatch
    });
  }, []);

  const clearCompletedTasks = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_COMPLETED_TASKS });
  }, []);

  const addTrackedApp = useCallback(
    ({ name, category }) => {
      const trimmedName = String(name || '').trim();
      if (!trimmedName) return false;
      const exists = state.trackedApps.some(
        (app) => app.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (exists) return false;
      dispatch({
        type: actionTypes.ADD_TRACKED_APP,
        payload: {
          id: createId(),
          name: trimmedName,
          category: String(category || '').trim() || 'General',
          totalSeconds: 0,
          openCount: 0,
          sessions: [],
          isRunning: false,
          lastStartedAt: null,
          createdAt: new Date().toISOString()
        }
      });
      return true;
    },
    [state.trackedApps]
  );

  const startTrackedApp = useCallback(
    async (id) => {
      dispatch({
        type: actionTypes.START_TRACKED_APP,
        payload: {
          id,
          startedAt: new Date().toISOString()
        }
      });
      if (state.settings.hapticsEnabled) {
        await Haptics.selectionAsync();
      }
    },
    [state.settings.hapticsEnabled]
  );

  const stopTrackedApp = useCallback(
    async (id) => {
      dispatch({
        type: actionTypes.STOP_TRACKED_APP,
        payload: {
          id,
          endedAt: new Date().toISOString()
        }
      });
      if (state.settings.hapticsEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [state.settings.hapticsEnabled]
  );

  const removeTrackedApp = useCallback((id) => {
    dispatch({
      type: actionTypes.REMOVE_TRACKED_APP,
      payload: { id }
    });
  }, []);

  const signUpWithEmail = useCallback(async ({ email, password, name }) => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name?.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }
    await setDoc(
      doc(db, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        email: credential.user.email || email.trim(),
        displayName: name?.trim() || credential.user.displayName || '',
        mission: '',
        age: '',
        city: '',
        profession: '',
        photoURL: credential.user.photoURL || '',
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    return credential.user;
  }, []);

  const signInWithEmail = useCallback(async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const sendVerification = useCallback(async () => {
    if (!auth.currentUser) return false;
    await sendEmailVerification(auth.currentUser);
    return true;
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    const cleanEmail = String(email || '').trim();
    if (!cleanEmail) return false;
    await sendPasswordResetEmail(auth, cleanEmail);
    return true;
  }, []);

  const sendMagicLink = useCallback(async (email) => {
    const cleanEmail = String(email || '').trim();
    if (!cleanEmail) return false;
    await sendSignInLinkToEmail(auth, cleanEmail, {
      url: 'https://upcore-59369.firebaseapp.com/__/auth/action',
      handleCodeInApp: true
    });
    return true;
  }, []);

  const uploadProfileAvatar = useCallback(
    async (uri) => {
      if (!authUser?.uid || !uri) return null;
      const response = await fetch(uri);
      const blob = await response.blob();
      const avatarRef = ref(storage, `avatars/${authUser.uid}.jpg`);
      await uploadBytes(avatarRef, blob);
      const photoURL = await getDownloadURL(avatarRef);
      await setDoc(
        doc(db, 'users', authUser.uid),
        {
          photoURL,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
      dispatch({
        type: actionTypes.SET_PROFILE,
        payload: { photoURL }
      });
      return photoURL;
    },
    [authUser?.uid]
  );

  const subscribePublicUsers = useCallback((listener) => {
    const usersQuery = query(collection(db, 'users'), limit(200));
    return onSnapshot(usersQuery, (snapshot) => {
      const users = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data(),
        followersCount: Array.isArray(entry.data()?.followers) ? entry.data().followers.length : 0,
        followingCount: Array.isArray(entry.data()?.following) ? entry.data().following.length : 0
      }));
      listener(users);
    });
  }, []);

  const followUser = useCallback(
    async (targetUid) => {
      if (!authUser?.uid || !targetUid || targetUid === authUser.uid) return false;
      await setDoc(doc(db, 'users', authUser.uid), {
        following: arrayUnion(targetUid),
        updatedAt: serverTimestamp()
      }, { merge: true });
      await setDoc(doc(db, 'users', targetUid), {
        followers: arrayUnion(authUser.uid),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    },
    [authUser?.uid]
  );

  const unfollowUser = useCallback(
    async (targetUid) => {
      if (!authUser?.uid || !targetUid || targetUid === authUser.uid) return false;
      await setDoc(doc(db, 'users', authUser.uid), {
        following: arrayRemove(targetUid),
        updatedAt: serverTimestamp()
      }, { merge: true });
      await setDoc(doc(db, 'users', targetUid), {
        followers: arrayRemove(authUser.uid),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    },
    [authUser?.uid]
  );

  const subscribeUserById = useCallback((uid, listener) => {
    if (!uid) return () => {};
    return onSnapshot(doc(db, 'users', uid), (snapshot) => {
      if (!snapshot.exists()) {
        listener(null);
        return;
      }
      const data = snapshot.data();
      listener({
        uid,
        ...data,
        followersCount: Array.isArray(data.followers) ? data.followers.length : 0,
        followingCount: Array.isArray(data.following) ? data.following.length : 0,
        isFollowedByMe: Array.isArray(data.followers) && authUser?.uid
          ? data.followers.includes(authUser.uid)
          : false
      });
    });
  }, [authUser?.uid]);

  const subscribeAiMessages = useCallback(
    (listener) => {
      if (!authUser?.uid) return () => {};
      const messagesQuery = query(
        collection(db, 'aiChats', authUser.uid, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(300)
      );
      return onSnapshot(messagesQuery, (snapshot) => {
        const data = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data()
        }));
        listener(data);
      });
    },
    [authUser?.uid]
  );

  const sendAiMessage = useCallback(
    async (text) => {
      const cleanText = String(text || '').trim();
      if (!authUser?.uid || !cleanText) return false;

      const userPayload = {
        role: 'user',
        text: cleanText,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'aiChats', authUser.uid, 'messages'), userPayload);

      const historySnap = await getDoc(doc(db, 'users', authUser.uid));
      const profileFromCloud = historySnap.exists() ? historySnap.data() : {};
      const aiText = await generateAiChatReply({
        language: state.settings.language,
        profile: {
          name: profileFromCloud.displayName || state.profile.name,
          mission: profileFromCloud.mission || state.profile.mission
        },
        metrics,
        conversation: [{ role: 'user', text: cleanText }],
        userMessage: cleanText
      });
      await addDoc(collection(db, 'aiChats', authUser.uid, 'messages'), {
        role: 'assistant',
        text: aiText || 'Keep going. You can do it.',
        createdAt: serverTimestamp()
      });
      return true;
    },
    [authUser?.uid, metrics, state.profile.mission, state.profile.name, state.settings.language]
  );

  const sendGlobalMessage = useCallback(
    async (text, replyTo = null) => {
      const cleanText = String(text || '').trim();
      if (!authUser?.uid || !cleanText) return false;
      await addDoc(collection(db, 'globalMessages'), {
        text: cleanText,
        userId: authUser.uid,
        userName: authUser.displayName || state.profile.name || authUser.email || 'User',
        replyTo: replyTo
          ? {
              id: replyTo.id || '',
              text: String(replyTo.text || '').slice(0, 80),
              userName: replyTo.userName || 'User'
            }
          : null,
        createdAt: serverTimestamp()
      });
      return true;
    },
    [authUser, state.profile.name]
  );

  const subscribeGlobalMessages = useCallback((listener) => {
    const messagesQuery = query(
      collection(db, 'globalMessages'),
      orderBy('createdAt', 'asc'),
      limit(250)
    );
    return onSnapshot(messagesQuery, (snapshot) => {
      const data = snapshot.docs.map((entry) => ({
        id: entry.id,
        ...entry.data()
      }));
      listener(data);
    });
  }, []);

  const subscribeUsers = useCallback(
    (listener) => {
      const usersQuery = query(collection(db, 'users'), limit(200));
      return onSnapshot(usersQuery, (snapshot) => {
        const users = snapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }))
          .filter((user) => user.uid !== authUser?.uid)
          .sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')));
        listener(users);
      });
    },
    [authUser?.uid]
  );

  const sendDirectMessage = useCallback(
    async ({ peerId, text, replyTo = null }) => {
      const cleanText = String(text || '').trim();
      if (!authUser?.uid || !peerId || !cleanText) return false;
      const roomId = createRoomId(authUser.uid, peerId);
      await addDoc(collection(db, 'privateRooms', roomId, 'messages'), {
        text: cleanText,
        userId: authUser.uid,
        userName: authUser.displayName || state.profile.name || authUser.email || 'User',
        replyTo: replyTo
          ? {
              id: replyTo.id || '',
              text: String(replyTo.text || '').slice(0, 80),
              userName: replyTo.userName || 'User'
            }
          : null,
        createdAt: serverTimestamp()
      });
      return true;
    },
    [authUser, state.profile.name]
  );

  const subscribeDirectMessages = useCallback(
    (peerId, listener) => {
      if (!authUser?.uid || !peerId) return () => {};
      const roomId = createRoomId(authUser.uid, peerId);
      const roomQuery = query(
        collection(db, 'privateRooms', roomId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(250)
      );
      return onSnapshot(roomQuery, (snapshot) => {
        const data = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data()
        }));
        listener(data);
      });
    },
    [authUser?.uid]
  );

  const t = useCallback(
    (key) => {
      const lang = state.settings.language || 'ru';
      return translations[lang]?.[key] || translations.en[key] || key;
    },
    [state.settings.language]
  );

  const palette = useMemo(() => getPalette(state.settings.theme), [state.settings.theme]);

  const value = useMemo(
    () => ({
      loaded: state.loaded,
      authUser,
      authReady,
      profile: state.profile,
      tasks: state.tasks,
      goals: state.goals,
      settings: state.settings,
      palette,
      t,
      metrics,
      trackedApps: state.trackedApps,
      addTask,
      toggleTask,
      removeTask,
      addGoal,
      updateGoal,
      removeGoal,
      setDailyTaskTarget,
      setProfile,
      updateSettings,
      clearCompletedTasks,
      addTrackedApp,
      startTrackedApp,
      stopTrackedApp,
      removeTrackedApp,
      signUpWithEmail,
      signInWithEmail,
      signOutUser,
      sendGlobalMessage,
      subscribeGlobalMessages,
      subscribeUsers,
      sendDirectMessage,
      subscribeDirectMessages,
      sendVerification,
      sendPasswordReset,
      sendMagicLink,
      uploadProfileAvatar,
      subscribePublicUsers,
      followUser,
      unfollowUser,
      subscribeUserById,
      subscribeAiMessages,
      sendAiMessage
    }),
    [
      addGoal,
      addTask,
      authReady,
      authUser,
      metrics,
      palette,
      removeGoal,
      removeTask,
      removeTrackedApp,
      setDailyTaskTarget,
      setProfile,
      sendDirectMessage,
      sendMagicLink,
      sendGlobalMessage,
      sendPasswordReset,
      sendVerification,
      sendAiMessage,
      signInWithEmail,
      signOutUser,
      signUpWithEmail,
      startTrackedApp,
      state.goals,
      state.loaded,
      state.profile,
      state.settings,
      state.tasks,
      state.trackedApps,
      subscribeAiMessages,
      stopTrackedApp,
      subscribeDirectMessages,
      subscribeGlobalMessages,
      subscribePublicUsers,
      subscribeUserById,
      subscribeUsers,
      t,
      toggleTask,
      unfollowUser,
      uploadProfileAvatar,
      addTrackedApp,
      clearCompletedTasks,
      followUser,
      updateGoal,
      updateSettings
    ]
  );

  return <SuccessContext.Provider value={value}>{children}</SuccessContext.Provider>;
};

export const useSuccess = () => {
  const context = useContext(SuccessContext);
  if (!context) {
    throw new Error('useSuccess must be used inside SuccessProvider');
  }
  return context;
};
