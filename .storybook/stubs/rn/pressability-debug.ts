// Vite alias target for react-native/Libraries/Pressability/PressabilityDebug.
// Debug-only view (gesture-handler re-exports it); render nothing in tests.
import React from "react";

export const PressabilityDebugView = (_props: any) => React.createElement(React.Fragment, null);
export default PressabilityDebugView;
