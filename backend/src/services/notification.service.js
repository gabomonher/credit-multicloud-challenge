function notify(event, payload) {
    const log = {
      timestamp: new Date().toISOString(),
      event,
      payload
    };
  
    console.log(JSON.stringify(log));
  }
  
  module.exports = { notify };
  