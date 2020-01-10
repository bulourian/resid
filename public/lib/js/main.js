$(document).ready(function() {
  let form = document.querySelectorAll('.formy')[0];
  let type = document.querySelector('select[name=type]');
  let bid = document.querySelector('input[name=bid]');
  let name = document.querySelector('input[name=name]');
  let reciept = document.querySelector('select[name=reciept]');
  let payment = document.querySelector('input[name=payment]');
  let datetime = document.querySelector('input[name=datetime]');
  let btnSabt = document.querySelector('#btn-sabt');

  $('#datetime').MdPersianDateTimePicker({
    targetTextSelector: '#datetime',
    enableTimePicker: true,
  }).on('hidden.bs.popover', function () {
    console.log($('#datetime').MdPersianDateTimePicker('getText'))
  });

  payment.addEventListener('keyup', function(evt){
    if (/\d/g.test(payment.value)) {
      var n = parseInt(this.value.replace(/\D/g,''),10);
      payment.value = new Intl.NumberFormat().format(n)//n.toLocaleString();
    }
  }, false);

  $('#btn-sabt').click((e) => {
    e.preventDefault();
    btnSabt.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      صبر کنید ...`;
    btnSabt.disabled = true;
    fetch('http://localhost:3000/resid', {
      method: 'POST',
      body: new URLSearchParams(new FormData(form))
    }).then( response => {
      btnSabt.innerHTML = 'ثبت';
      btnSabt.disabled = false;
      form.reset();
    }).catch( err => {
      console.log(err);
    });

  });
});