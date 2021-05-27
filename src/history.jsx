import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({ basename: '/' });

let pastLocations = [];
function updatePastLocations(location, action) {
  console.group();
  console.log('initial', { location, action, pastLocations });
  if (['/', '/signin', '/logout'].includes(location.pathname)) {
    pastLocations = [];
    console.log('update', { location, action, pastLocations });
    console.groupEnd();
    return;
  }

  // if ((pastLocations[0] && pastLocations[0].pathname === location.pathname)) {
  //   console.log('update', { location, action, pastLocations });
  //   console.groupEnd();
  //   return;
  // }

  switch (action) {
    case 'PUSH':
      // first location when app loads and when pushing onto history
      pastLocations.push(location);
      break;
    case 'REPLACE':
      // only when using history.replace
      pastLocations[pastLocations.length - 1] = location;
      break;
    case 'POP': {
      // happens when using the back button, or forward button
      pastLocations.pop();
      // location according to pastLocations
      const appLocation = pastLocations[pastLocations.length - 1];
      if (!(appLocation && appLocation.key === location.key)) {
        // If the current location doesn't match what the app thinks is the current location,
        // blow up the app history.
        pastLocations = [location];
      }
      break;
    }
    default:
  }
  console.log('update', { location, action, pastLocations });
  console.groupEnd();
}
history.listen(updatePastLocations);

function isPreviousLocationWithinApp() {
  return pastLocations.length > 1;
}
export function getPrevLocationOrReplace(location) {
  console.group();
  console.log({ pastLocations });
  if (isPreviousLocationWithinApp()) {
    console.log(pastLocations[pastLocations.length - 2]);
    console.groupEnd();
    return pastLocations[pastLocations.length - 2];
  } else {
    console.log(location);
    console.groupEnd();
    return location;
  }
}

export function goBackOrReplace(location, state) {
  if (isPreviousLocationWithinApp()) {
    history.goBack();
  } else {
    history.replace(location, state);
  }
}
