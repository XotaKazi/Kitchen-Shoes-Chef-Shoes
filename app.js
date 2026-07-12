document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('paypal-button-container');
  if (!container || typeof paypal === 'undefined') return;

  var UNIT_PRICE = 49.00; // keep this in sync with the price shown on the page

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
            currency_code: 'USD'
          }
        }]
      });
    },

    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        var resultEl = document.getElementById('result-message');
        var name = (details.payer && details.payer.name && details.payer.name.given_name) || 'there';
        if (resultEl) {
          resultEl.textContent = 'Thanks, ' + name + '! Your order is confirmed.';
          resultEl.style.color = 'var(--flame, #FF5A1F)';
        }
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
