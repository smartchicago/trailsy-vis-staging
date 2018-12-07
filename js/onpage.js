jQuery(function ($) {
    // Fetch our events
    var url_base = 'https://map.fpdcc.com'
    var data_url = url_base + '/alerts/list.json'

    var drawAlerts = function (alerts) {
        var html = ''
        $.each(alerts, function(key, alert) {
            if (alert.end_date === null) {
                alert.end_date = '?'
            }
            var classType = "warning"
            var alertTypeName = "ALERT"
            if (alert.alert_type == "closure") {
                classType = "danger"
                alertTypeName = "CLOSURE"
            }
            html += "<li class='alerts bg_" + classType + "'><span class='label_" + classType + "'>" + alertTypeName + "</span> <strong>" + alert.start_date + " - " + alert.end_date + "</strong>: " + alert.description + "</li>"
        })
        return html
    }

    var alertlistdivs = Array.from( document.getElementsByClassName('alertlist'))

    console.log(alertlistdivs)
    $.getJSON( data_url, function ( data ) {
      var items = [];
      var listHTML = ''
      var globalAlerts = data['global']
      var locationAlerts = data['locations']
      // Iterate through all alertlist divs
      alertlistdivs.forEach(function(alertdiv) {
        console.log(alertdiv.parentElement.dataset.id);
        var divLocId = alertdiv.parentElement.dataset.id
        var divLocType = alertdiv.parentElement.dataset.loctype
        listHTML = '<ul class="alerts"><li class="bg_open"><span class="label_open">NO ISSUES</span> Open during normal hours.</li></ul>'

        if (divLocId == 'all') {
            var liHTML = ''
            $.each(locationAlerts, function(key, val) {
                if (val.type == divLocType) {
                    var map_id = val.map_id.replace(/[& ]/g, '+')
                    liHTML += "<ul class='alerts' id='" + map_id + "'><h4><a href='" + url_base + "/#/?" + val.type + "=" + map_id + "' target='_top'>" + val.name + "</a></h4>"
                    liHTML += drawAlerts(val.alerts)
                    liHTML += "</ul>"
                }
            })
            if (liHTML != '') {
                listHTML = liHTML
            }
        } else {
            $.each(locationAlerts, function(key, val) {
                if (val.id == divLocId && val.type == divLocType) {
                    var liHTML = ''
                    liHTML += drawAlerts(val.alerts)
                    if (liHTML != '') {
                        listHTML = "<ul class='alerts' id='" + divLocId + '-' + divLocType + "'>" + liHTML + '</ul>'
                    }
                    return false
                }
            })
        }
      
        alertdiv.innerHTML = listHTML
      })
        
  
     
      // $( "<ul/>", {
      //   "class": "my-new-list",
      //   html: items.join( "" )
      // }).appendTo( "body" );
    });
});
