document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('paypal-button-container');
  if (!container || typeof paypal === 'undefined') return;

  var UNIT_PRICE = 42.00; // keep this in sync with the price shown on the page

  function getOrderDetails() {
    var sizeBtn = document.querySelector('#sizeGrid .selected');
    var colorBtn = document.querySelector('#colorGrid .selected');
    var qtyInput = document.getElementById('qtyInput');

    var size = sizeBtn ? sizeBtn.getAttribute('data-size') : 'N/A';
    var color = colorBtn ? colorBtn.getAttribute('data-color') : 'N/A';
    var qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

    return { size: size, color: color, qty: qty };
  }

  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },

    createOrder: function (data, actions) {
      var order = getOrderDetails();
      var total = (UNIT_PRICE * order.qty).toFixed(2);

      return actions.order.create({
        purchase_units: [{
          description: 'Stride Classic Chef Shoe — Size ' + order.size + ', ' + order.color + ' x' + order.qty,
          amount: {
            value: total,
            currency_code: 'AUD'
          }
        }]
      });
    },

    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        if (details.status === 'COMPLETED') {
          var order = getOrderDetails();
          var total = (UNIT_PRICE * order.qty).toFixed(2);
          var params = new URLSearchParams({
            order_id: details.id,
            items: 'Size ' + order.size + ' ' + order.color + ' x' + order.qty,
            total: total
          });
          window.location.href = 'order-confirmed.html?' + params.toString();
        } else {
          var resultEl = document.getElementById('result-message');
          if (resultEl) {
            resultEl.textContent = 'Your payment did not go through (status: ' + details.status + '). Please try again or use a different payment method — you have not been charged.';
            resultEl.style.color = '#c0392b';
          }
          console.warn('PayPal capture did not complete:', details);
        }
      }).catch(function (err) {
        var resultEl = document.getElementById('result-message');
        if (resultEl) {
          resultEl.textContent = 'Something went wrong processing your payment. Please try again — you have not been charged.';
          resultEl.style.color = '#c0392b';
        }
        console.error('PayPal capture error:', err);
      });
    },

    onCancel: function () {
      var resultEl = document.getElementById('result-message');
      if (resultEl) resultEl.textContent = 'Checkout cancelled — no charge was made.';
    },

    onError: function (err) {
      var resultEl = document.getElementById('result-message');
      if (resultEl) resultEl.textContent = 'Something went wrong with your payment. Please try again.';
      console.error('PayPal Checkout error:', err);
    }
  }).render('#paypal-button-container');
});
