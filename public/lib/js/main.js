$(document).ready(function() {
  let form = document.querySelectorAll('.formy')[0];
  let type = document.querySelector('select[name=type]');
  let bid = document.querySelector('input[name=bid]');
  let name = document.querySelector('input[name=name]');
  let reciept = document.querySelector('select[name=reciept]');
  let payment = document.querySelector('input[name=payment]');
  let datetime = document.querySelector('input[name=datetime]');
  let btnSabt = document.querySelector('#btn-sabt');

  const toEnglishDigit = function (val) {
    return (val + '').replace(/[\u06F0-\u06F9]/g, digit => String.fromCharCode( digit.charCodeAt(0) - 1728 ));
  }

  $('#datetime').MdPersianDateTimePicker({
    targetTextSelector: '#datetime',
    enableTimePicker: true,
  }).on('hidden.bs.popover', function () {
    console.log($('#datetime').MdPersianDateTimePicker('getText'))
  });

  payment.addEventListener('keyup', function(evt){
    if (/(\d|[\u06F0-\u06F9])/g.test(payment.value)) {
      var n = parseInt(this.value.replace(/\D/g,''),10);
      payment.value = new Intl.NumberFormat().format(n);
    }
  }, false);

  $('#btn-sabt').click((e) => {
    e.preventDefault();
    btnSabt.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      صبر کنید ...`;
    btnSabt.disabled = true;
    fetch('http://sony:3000/resid', {
      method: 'POST',
      body: new URLSearchParams(new FormData(form))
    }).then( response => {
      btnSabt.innerHTML = 'ثبت';
      btnSabt.disabled = false;
      form.reset();
      const socket = new WebSocket('ws://sony:8080/');

      socket.addEventListener('open', function (event) {
        socket.send('json');
      });
    }).catch( err => {
      console.log(err);
    });
  });
});