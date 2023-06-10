// eslint-disable-next-line react-refresh/only-export-components
export default (state, action) => {
  switch (action.type) {
    case "ADD_LAUNCHER_TO_FAVORITELAUNCHER":
      return {
        ...state,
        favoritelauncher: [action.payload, ...state.favoritelauncher],
      };

    case "REMOVE_LAUNCHER_TO_FAVORITELAUNCHER":
      return {
        ...state,
        favoritelauncher: state.favoritelauncher.filter(
          (launcher) => launcher.id !== action.payload
        ),
      };
    case "REMOVE_ALL_LAUNCHER_IN_FAVORITELAUNCHER":
      return {
        ...state,
        favoritelauncher: [],
      };

    default:
      return state;
  }
};
