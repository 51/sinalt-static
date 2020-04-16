$(document).ready(function() {
	/**
	 	$("#gen_url").fancybox({
		'titlePosition'		: 'inside',
		'transitionIn'		: 'none',
		'transitionOut'		: 'none'
	})
	* */
	$("input[type=text]").focus(function(){
		this.select();
	});


});
function clickify_links($text) { return $text.match(/((https?:\/\/)?([-\w]+.[-\w.]+)+\w(:\d+)?(\/([-\w_.]*(\?\S+)?)?)*)/gim); }
var jiathis_config = {};
function showMsg(content){
	$("#errmsg").html(content);
}
function showWallMsg(){
	$("#errmsg").html('<span style="color:#34900A;">温馨提示：您选择的后缀仅供<span style="color:rgb(77, 144, 254);">海外用户</span>使用，在中国大陆地区可能无法访问。</span>');
}
function showTypeMsg(type){
	$("#errmsg").html('<span style="color:#34900A;">温馨提示：您选择的后缀仅供<span style="color:rgb(77, 144, 254);">'+type+'</span>网站使用。</span>');
}
function showWxMsg(){
	$("#errmsg").html('<span style="color:#34900A;">温馨提示：您选择的后缀仅供短信推广等一般访问方式，不支持在<span style="color:rgb(77, 144, 254);">微信</span>等APP内使用。</span>');
}
function hideWallMsg(content){
	$("#errmsg").html('');
}
function short(url, site){
//alert(decodeURIComponent(url));
//alert(encodeURIComponent(url));
//return false;
	//a=clickify_links(url);alert(a);
	$("#errmsg").html("");
	if (url == '' || url == undefined) {
		showMsg("请收入要缩短的URL。");
		return false;
	}
	if (site == '' || site == undefined) {
		site = 'sinalt';
	}
	$.fancybox.showActivity();
	//var request = "api.php?url="+encodeURIComponent(url)+"&site="+site;
	var request = "api.php?from=w&url="+ base64encode(utf16to8(url))+"&site="+site;

	$.ajax({
		dataType: "json",
		url: request,
		jsonp: "$callback",
		success: function(response) {
			//console.log(response);
			if (response.result == 'captcha') {
				$.fancybox.hideActivity();

				$("#div_id_embed").empty('');
				//console.log($("#div_id_embed").html);
				//$("#captchavalue").val(response.data.code);
				s = document.createElement('script');
				s.src = 'https://api.geetest.com/get.php?callback=gtcallback';
				$("#div_geetest_lib").append(s);
				//console.log($("#div_geetest_lib").html);
				gtcallback(response.data);


				$.fancybox({
					'href' : "#captchadiv"
				});

				return false;
			}
			if (response.result != 'ok'){
				$.fancybox.hideActivity();
				showMsg(response.data);
				return false;
			}
			$("#result_url").val(response.data.short_url);
			$("#shareurl").html(response.data.short_url);
			$("#gobutton").attr("href", response.data.short_url);
            if (response.data.black == 1) {
				//$("#sharefriend").html('<span style="color:#F24F0B">提醒：您提交的网站未能通过安全管家的检测，在“<span style="color:#FF0000">微信</span>”中访问将出现安全提示，建议您前往<a href="submit_site.php" target="_blank">安全管家</a>提交您的网站。</span>');
				$("#sharefriend").html('<span style="color:#F24F0B">提醒：因微信的审核机制，您的链接可能在“<span style="color:#FF0000">微信</span>”中访问时出现安全提示，由此带来不便敬请谅解。</span>');
                $("#quotecontent").hide();
            } else {
			    $("#sharecontent").html(response.data.title);
			    $("#sharefriend").html('预览：');
                $("#quotecontent").show();
            }
            //console.log(response.data);

			jiathis_config = {
				url: response.data.short_url,
				title: response.data.title
			}
			$.fancybox({
				'href' : "#resultdiv"
			});
			$("#result_url").select();
		}
	});
	return false;
}

function cashort(url, site, validate){

	var request = "api.php?url="+ base64encode(utf16to8(url))+"&site="+site;
	request += "&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;
	$.ajax({
		dataType: "json",
		url: request,
		jsonp: "$callback",
		success: function(response) {
			if (response.result != 'ok'){
				//console.log(response);
				$.fancybox.close();
				//$.fancybox.hideActivity();
				showMsg(response.data);
				return false;
			}
			//console.log(response)
			$("#result_url").val(response.data.short_url);
			$("#sharecontent").html(response.data.title);
			$("#shareurl").html(response.data.short_url);
			$("#gobutton").attr("href", response.data.short_url);

			jiathis_config = {
				url: response.data.short_url,
				title: response.data.title
			}
			$.fancybox({
				'href' : "#resultdiv"
			});
			$("#result_url").select();
		}
	});
	return false;
}

function unshort(url){
//return false;
	//a=clickify_links(url);alert(a);
	$("#errmsg").html("");
	if (url == '' || url == undefined) {
		showMsg("请收入要还原的URL。");
		return false;
	}

	$.fancybox.showActivity();
	var request = "api.php?url="+base64encode(utf16to8(url))+"&action=restore";

	$.ajax({
		dataType: "json",
		url: request,
		jsonp: "$callback",
		success: function(response) {
			if (response.result != 'ok'){
				$.fancybox.hideActivity();
				showMsg(response.data);
				return false;
			}
			$("#result_url").val(response.data.short_url);
			$("#sharecontent").html(response.data.title);
			$("#shareurl").html(response.data.short_url);
			$("#gobutton").attr("href", response.data.short_url);

			jiathis_config = {
				url: response.data.short_url,
				title: response.data.title
			}
			$.fancybox({
				'href' : "#resultdiv"
			});
			$("#result_url").select();
		}
	});
	return false;
}



function anonymous(url){
	$("#errmsg").html("");
	if (url == '' || url == undefined) {
		showMsg("请输入要匿名跳转的URL。");
		return false;
	}

	$.fancybox.showActivity();
	var request = "api_anonymous.php?url="+base64encode(utf16to8(url))+"&action=anonymous";

	$.ajax({
		dataType: "json",
		url: request,
		jsonp: "$callback",
		success: function(response) {
			if (response.result != 'ok'){
				$.fancybox.hideActivity();
				showMsg(response.data);
				return false;
			}
			$("#result_url").val(response.data.short_url);
			$("#sharecontent").html(response.data.title);
			$("#shareurl").html(response.data.short_url);
			$("#gobutton").attr("href", response.data.short_url);

			jiathis_config = {
				url: response.data.short_url,
				title: response.data.title
			}
			$.fancybox({
				'href' : "#resultdiv"
			});
			$("#result_url").select();
		}
	});
	return false;
}
