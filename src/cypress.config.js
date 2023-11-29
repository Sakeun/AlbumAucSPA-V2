const { defineConfig } = require("cypress");

module.exports = defineConfig({
  experimentalStudio: true,
  e2e: {
    setupNodeEvents(on, config) {
      
    },
  },
});
