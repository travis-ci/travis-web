window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Using `ApplicationInstance.container.lookup` is deprecated. Please use `ApplicationInstance.lookup` instead." },
  ]
};
