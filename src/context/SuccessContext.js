import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react';
import { getPastDays, isSameDay, startOfDay } from '../utils/date';
import { loadState, saveState } from '../storage/storage';
import { getPalette } from '../constants/theme';
import { translations } from '../i18n/translations';
import {
  cancelTaskReminder,
  requestNotificationPermission,
  scheduleTaskReminder,
  setupNotifications
} from '../services/notifications';

const SuccessContext = createContext(null);

const initialState = {
  loaded: false,
  profile: {
    name: '',
    mission: '',
    ready: false
  },
  tasks: [],
  goals: [],
  settings: {
    theme: 'dark',
    language: 'ru',
    notificationsEnabled: false,
    dailyTaskTarget: 3,
    compactMode: false
  },
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
  SET_TASK_NOTIFICATION: 'SET_TASK_NOTIFICATION'
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
    default:
      return state;
  }
};

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

export const SuccessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    if (!state.loaded) return;
    saveState({
      profile: state.profile,
      tasks: state.tasks,
      goals: state.goals,
      settings: state.settings,
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
        minutesBefore: 20
      });
      if (notificationId) {
        dispatch({
          type: actionTypes.SET_TASK_NOTIFICATION,
          payload: { id, notificationId }
        });
      }
    },
    [state.settings.notificationsEnabled]
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

  const addGoal = useCallback(({ title, target }) => {
    const payload = {
      id: createId(),
      title,
      target: Math.max(1, Number(target) || 1),
      current: 0,
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

  const setProfile = useCallback((profileData) => {
    dispatch({
      type: actionTypes.SET_PROFILE,
      payload: {
        ...profileData,
        ready: true
      }
    });
  }, []);

  const updateSettings = useCallback((settingsPatch) => {
    dispatch({
      type: actionTypes.SET_SETTINGS,
      payload: settingsPatch
    });
  }, []);

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
      profile: state.profile,
      tasks: state.tasks,
      goals: state.goals,
      settings: state.settings,
      palette,
      t,
      metrics,
      addTask,
      toggleTask,
      removeTask,
      addGoal,
      updateGoal,
      removeGoal,
      setDailyTaskTarget,
      setProfile,
      updateSettings
    }),
    [
      addGoal,
      addTask,
      metrics,
      palette,
      removeGoal,
      removeTask,
      setDailyTaskTarget,
      setProfile,
      state.goals,
      state.loaded,
      state.profile,
      state.settings,
      state.tasks,
      t,
      toggleTask,
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
