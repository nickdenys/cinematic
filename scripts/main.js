function showNotification(type, message){
  var css;

  switch(type){
    case 1:
      css = 'flash-success';
      break;
    case 2:
      css = 'flash-error';
      break;
    case 3:
      css = 'flash-notice';
      break;
    case 4:
      css = 'flash-alert';
      break;
    default:
      css = 'flash-notice';
  }

  var flash = $('#flash');
  flash.hide().removeClass().addClass(css);
  flash.find('.content').html(message);
  flash.slideDown(200, function(){
    setTimeout(function(){
      flash.slideUp();
    }, 2000);
  });
}