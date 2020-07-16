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
                resolve(window.funnelEnvy);
              }
            }
            else {
              clearInterval(interval);
              resolve(false);
            }
            attempts++;
          }, 20);
  })

  /**
 * Function to return a value recived from Funnelenvy condition selected
 * @return Promise
 */
  Drupal.smartContent.plugin.Field['funnelenvy'] = function (condition) {
    let key = condition.field.pluginId.split(':')[1];
        Drupal.smartContent.funnelenvy = new Promise((resolve, reject) => {
          Promise.resolve(Drupal.smartContent.waitForFunnelenvy).then(function(funnelEnvy){
            if(funnelEnvy){
              if(key === 'variationSlug'){
                funnelEnvy.addListener('backstage.activeVariation', function(model, message) {
                  if((model && model.event) === 'backstage.activeVariation'){
                    resolve(model.backstage.activeVariation)
                  }
                });
              }else{
                funnelEnvy.addListener('backstage.updatedAudiences', function(model, message) {
                  if((model && model.event) === 'backstage.updatedAudiences'){
                    resolve(model.backstage.audiences[condition.settings.value])
                  }
                });
              }
              
              // Resolve the segement if non of the above listener get fired
              funnelEnvy.addListener('backstage.updatedAccountData',function(model,message) {
                if((model && model.event) === 'backstage.updatedAccountData'){
                  resolve(false)
                }
              })

            }else{
              resolve(false);
            }
          })
        });

    // resolve with value recieved from listener so smart_content can evaluate wheather it is true of not
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
