let isFirstStartEvent = true;

const toggleFirstStartTrue = () => {
  isFirstStartEvent = true;
};

const toggleFirstStartFalse = () => {
  isFirstStartEvent = false;
};

export { isFirstStartEvent, toggleFirstStartTrue, toggleFirstStartFalse };
