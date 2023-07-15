import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type TTaskState = {
  value: string
  done: boolean
}

type TChangeTask = {
  id: number
  done: boolean
}

const initialState: TTaskState[] = []

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasksFromLocalStorage: (state) => {
      const tasks = localStorage.getItem('todoListTasks')
      return tasks ? JSON.parse(tasks) : []
    },
    addTask: (state, action: PayloadAction<TTaskState>) => {
      state.push(action.payload)
      localStorage.setItem('todoListTasks', JSON.stringify(state))
      return state
    },
    changeTask: (state, action: PayloadAction<TChangeTask>) => {
      const { id, done } = action.payload
      const currentValue = state[id].value
      state[id] = { value: currentValue, done }
      localStorage.setItem('todoListTasks', JSON.stringify(state))
      return state
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1)
      localStorage.setItem('todoListTasks', JSON.stringify(state))
      return state
    },
  },
})

export const { addTask, setTasksFromLocalStorage, changeTask, removeTask } = tasksSlice.actions
export const tasksSliceReducer = tasksSlice.reducer
