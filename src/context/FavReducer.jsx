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
    case "UPDATE_SORT_LAUNCHER":
      if (action.sortType === "ascend") {
        return {
          ...state,
          favoritelauncher: state.favoritelauncher
            .slice()
            .sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            ),
        };
      } else if (action.sortType === "descend") {
        return {
          ...state,
          favoritelauncher: state.favoritelauncher
            .slice()
            .sort((a, b) =>
              b.name.toLowerCase().localeCompare(a.name.toLowerCase())
            ),
        };
      }
      break;
    default:
      return state;
  }
};
