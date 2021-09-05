import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, Dispatch } from './store'

// Use these instead of default redux hooks
export const useAppDispatch=()=>useDispatch<Dispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector