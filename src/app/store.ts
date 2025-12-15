import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import workShiftReducer from '@/features/work-shift/model/workShiftSlice'
import { clinicReducer } from '@/features/clinic'
import hanhchinhReducer from '@/features/hanhchinh/model/hanhchinhSlice'
import { selectDialogReducer } from '@/shared/store/selectDialog'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workShift: workShiftReducer,
    clinic: clinicReducer,
    selectDialog: selectDialogReducer,
    hanhchinh: hanhchinhReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed
        // ignoredActions: ['your/action/type'],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
