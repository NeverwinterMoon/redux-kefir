import { isFSA, isObservable } from './utils'

export default function observableMiddleware({dispatch}) {
  return next => action => {
    if (!isFSA(action)) {
      return isObservable(action)
        ? action.map(x => { dispatch(x); return x })
        : next(action)
    }

    if (isObservable(action.payload)) {
      return action.payload
          .map(x => { dispatch(Object.assign({}, action, { payload: x })); return x })
          .mapErrors(e => { dispatch(Object.assign({}, action, { payload: e, error: true })); return e })
    }

    return next(action)
  }
}
