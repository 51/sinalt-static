
var gtFailbackFrontInitial = function(result) {
	var s = document.createElement('script');
	s.id = 'gt_lib';
	s.src = 'https://static.geetest.com/static/js/geetest.0.0.0.js';
	s.charset = 'UTF-8';
	s.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(s);
	var loaded = false;
	s.onload = s.onreadystatechange = function() {
		if (!loaded && (!this.readyState|| this.readyState === 'loaded' || this.readyState === 'complete')) {
			loadGeetest(result);
			loaded = true;
		}
	};
}
//get  geetest server status, use the failback solution
var loadGeetest = function(config) {

	//1. use geetest capthca
	window.gt_captcha_obj = new window.Geetest({
		gt : config.gt,
		challenge : config.challenge,
		product : 'embed',
		offline : !config.success
	});
	gt_captcha_obj.appendTo("#div_id_embed");
    if (config.submit != 1) {
        gt_captcha_obj.onSuccess(function() {
            var validate = gt_captcha_obj.getValidate();
            cashort($('#longurl').val(), $('input[@name=shortsite][checked]').val(), validate)

        })
    }
}


var gtcallback =( function() {
	var status = 0, result, apiFail;
	return function(r) {
		status += 1;
		if (status > 2) {
			status = 1
		}
		if (r) {
			result = r;
			setTimeout(function() {
				if (!window.Geetest) {
					apiFail = true;
					gtFailbackFrontInitial(result)
				}
			}, 1000)
		}
		else if(apiFail) {
			return
		}
		if (status == 2) {
			loadGeetest(result);
		}
	}
})()
