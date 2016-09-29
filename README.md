redux-kefir-1
=============

Kefir bindings for Redux

```
npm install --save-dev redux-kefir-1
```

---

### *createProjection(store: [ReduxStore](http://redux.js.org/docs/basics/Store.html)): [KefirProperty](https://rpominov.github.io/kefir/#about-observables)*

Creates an observable of state over time from a Redux store.

```js
import { createProjection } from 'redux-kefir-1'
```

#### Usage

Given `store`, create a projection:

```js
const stateProjection = createProjection(store)
```

To do anything useful with the newly minted `stateProjection`, we must use the [Kefir API](https://rpominov.github.io/kefir/).

---

### *observableMiddleware: [ReduxMiddleware](http://redux.js.org/docs/advanced/Middleware.html)*

Enables dispatching Kefir observables and [Flux Standard Actions](https://github.com/acdlite/flux-standard-action) that have observable payloads.

```js
import { observableMiddleware } from 'redux-kefir-1'
```

#### Usage

```js
createStore = applyMiddleware(observableMiddleware)(createStore)
```

Or when using `ngRedux`:
```js
$ngReduxProvider.createStoreWith(reducers, [observableMiddleware])
````

Given a `store` and an action creator `count(payload: number): FSA`, dispatch a stream of `count` actions. For clarity and DRY, we'll define a stream creator `obs`:

```js
const obs = () => Kefir.sequentially(50, [1, 2])
```

Dispatch new observable stream, mapping its values through the action creator:
```js
const obsWithCount = store.dispatch(obs().map(count))
```

Or dispatch an FSA that has observable payload, essentially, inverting control:
```js
const obsWithCount = store.dispatch(count(obs()))
```

Both examples have the same outcome.

**Note** that dispatch will not subscribe to the observable `obs` (unlike in the original version of refux-kefir), instead allowing to subscribe at any later point, thus giving much more flexibility:
```js
obsWithCount
  .onAny(event => {
    console.log('event:', event);
  });
  
// event: Object {type: "value", value: 1}
// event: Object {type: "value", value: 2}
// event: Object {type: "end", value: undefined}
```
