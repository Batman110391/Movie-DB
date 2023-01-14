import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function shallowDiffers(prev, next) {
  for (let attribute in prev) {
    if (!(attribute in next)) {
      return true;
    }
  }
  for (let attribute in next) {
    if (prev[attribute] !== next[attribute]) {
      return true;
    }
  }
  return false;
}

export function areEqual(prevProps, nextProps) {
  const {
    style: prevStyle,
    isScrolling: prevIsScrolling,
    ...prevRest
  } = prevProps;
  const {
    style: nextStyle,
    isScrolling: nextIsScrolling,
    ...nextRest
  } = nextProps;

  return (
    !shallowDiffers(prevStyle, nextStyle) &&
    !shallowDiffers(prevRest, nextRest) &&
    (nextIsScrolling === prevIsScrolling || nextIsScrolling)
  );
}

export function useBreakpointWidht(breakpoint) {
  const theme = useTheme();
  let matches = useMediaQuery(theme.breakpoints.up(breakpoint));
  return matches;
}

export async function getItemCookie(key) {
  return new Promise((res, rej) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2) {
      res(parts.pop().split(";").shift());
    } else {
      res(null);
    }
  });
}

export function setItemCookie(key, value) {
  document.cookie = `${key}=${value};`;
}

export function removeItemCookie(key) {
  if (getItemCookie(key)) {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
}

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
