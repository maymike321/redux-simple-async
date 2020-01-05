import { MiddlewareAPI, Dispatch, AnyAction } from "redux";

export const asyncMiddleware = 
    (mwApi: MiddlewareAPI<Dispatch<AnyAction>>) => 
        (next: Dispatch<AnyAction>) => 
            async (action: any) => {
                if (!action.async) return next(action);
                next(action);
                return await action.async(mwApi.dispatch, mwApi.getState);
            }

type BehaviorWithPayload<TPayload> = (dispatch: Dispatch<AnyAction>, getState: () => any, payload: TPayload) => Promise<void>
type BehaviorWithoutPayload = (dispatch: Dispatch<AnyAction>, getState: () => any) => Promise<void>

export function createAsyncAction(type: string, behavior: BehaviorWithoutPayload): () => { async: (dispatch: Dispatch<AnyAction>, getState: () => any) => Promise<void>, type: string};
export function createAsyncAction<TPayload>(type: string, behavior: BehaviorWithPayload<TPayload>): (payload: TPayload) => { async: (dispatch: Dispatch<AnyAction>, getState: () => any) => Promise<void>, type: string, payload: TPayload};
export function createAsyncAction<TPayload>(type: string, behavior: BehaviorWithPayload<TPayload> | BehaviorWithoutPayload) {
    if (behavior.length === 3) {
        return (payload: TPayload) => ({
            async: async (dispatch: Dispatch<AnyAction>, getState: () => any) => behavior(dispatch, getState, payload),
            type,
            payload
        });
    } else if (behavior.length == 2) {
        return () => ({
            async: async (dispatch: Dispatch<AnyAction>, getState: () => any) => (behavior as BehaviorWithoutPayload)(dispatch, getState),
            type
        })
    }
}