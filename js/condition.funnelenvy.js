(function (Drupal) {
  Drupal.smartContent = Drupal.smartContent || {};
  Drupal.smartContent.plugin = Drupal.smartContent.plugin || {};
  Drupal.smartContent.plugin.Field = Drupal.smartContent.plugin.Field || {};

  // wait for funnelnevy
  Drupal.smartContent.waitForFunnelenvy = new Promise((resolve,reject) => {
    let attempts = 0;
          // todo: Give the interval more time to complete, but still resolve early
          //   if delayed too long.
          const interval =  setInterval(() => {
            if (attempts < 200) {
              if (window.funnelEnvy && typeof window.funnelEnvy.on === 'function') {
                clearInterval(interval);
                resolve(true);
              }
            }
            else {
              clearInterval(interval);
              resolve(false);
            }
            attempts++;
          }, 20);
  })

  // execute condition
  Drupal.smartContent.plugin.Field['funnelenvy'] = function (condition) {
    let key = condition.field.pluginId.split(':')[1];
        Drupal.smartContent.funnelenvy = new Promise((resolve, reject) => {
          Promise.resolve(Drupal.smartContent.waitForFunnelenvy).then(function(isFeAvailable){
            if(isFeAvailable){
              if(key === 'variationSlug'){
                window.funnelEnvy.addListener('backstage.activeVariation', function(model, message) {
                  if((model && model.event) === 'backstage.activeVariation'){
                    resolve(model.backstage.activeVariation)
                  }
                });
              }else{
                window.funnelEnvy.addListener('backstage.updatedAudiences', function(model, message) {
                  if((model && model.event) === 'backstage.updatedAudiences'){
                    resolve(model.backstage.audiences[condition.settings.value])
                  }
                });
              } 
            }else{
              resolve(false);
            }
          })
        });

    return Promise.resolve(Drupal.smartContent.funnelenvy).then( (value) => {
      if(value && value.hasOwnProperty(key)) {
        return value[key];
      }
      else {
        return '';
      }
    });
  }
}(Drupal));
