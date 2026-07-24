import { configureStore } from '@reduxjs/toolkit'
import riskSlice from './riskSlice'
import filtersSlice from './filtersSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      risk: riskSlice,
      filters: filtersSlice,
    },
  })
}