/**
 * Created by AnyGong on 2015/8/20.
 */
//ҳ���ʼ��
var app = new Framework7({
    modalTitle: 'Framework7',
    animateNavBackIcon: true,
    ajaxLinks: 'a.ajax'
});
var $$ = Dom7;

var mainView = app.addView('.view-main', {
    dynamicNavbar: true
});
