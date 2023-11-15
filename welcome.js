(function ( w, d, PKAE ) {
'use strict';

setTimeout(function () {

	PKAudioEditor._deps.Wlc = function () {
			var body_str = '';
			var body_str2 = '';

			if (PKAE.isMobile) {
				change -= 15;
				body_str = 'Tips:<br/>Asegúrese de que su dispositivo no esté en modo silencioso. Es posible que tengas que activar físicamente el interruptor silencioso. '+
				'<img src="phone-switch.jpg" style="max-width:224px;max-height:126px;width:40%;margin: 10px auto; display: block;"/>'+
				'<br/><br/>';
			}
			else {
				body_str = 'Tips:<br/>Tenga en cuenta que la mayoría de los atajos de teclado se basan en el combo de teclas <strong>Mayús + <u>teclas</u></strong>. (por ejemplo, Shift + Z para deshacer, Shift + C copiar, Shift + X cortar ... etc )<br/><br/>';
				body_str2 = 'Contactanos atravez de GITHUB <a href="https://github.com/rodrixc982" target="_blank">Github</a><br/><br/>'; // revisa el código en github
			}

			// Bienvenido a BIOSONIC,
			var md = new PKSimpleModal({
				title: '<font style="font-size:15px">BIENVENIDO BIOSONIC V1.1 </font>',
				ondestroy: function( q ) {
					PKAE.ui.InteractionHandler.on = false;
					PKAE.ui.KeyHandler.removeCallback ('modalTemp');
			},
			body:'<div style="overflow:auto;-webkit-overflow-scrolling:touch;max-width:580px;width:calc(100vw - 40px);max-height:calc(100vh - 340px);min-height:110px;font-size:13px; color:#95c6c6;padding-top:7px;">'+
				'BIOSONIC es un Softwarede audio y forma de Espectrograma, <br />Se ejecuta completamente en el navegador y escritorio, ni se requieren complementos.'+
				'<br/><br/><br/>'+
				body_str+
				'Puede cargar cualquier tipo de audio que admita su navegador y realizar operaciones como fundido de entrada, corte, recorte, cambio de volumen, '+
				'y aplicar una plétora de efectos de audio.<br/><br/>'+
				body_str2+
				'</div>',
			setup:function( q ) {
					PKAE.ui.InteractionHandler.checkAndSet ('modal');
					PKAE.ui.KeyHandler.addCallback ('modalTemp', function ( e ) {
						q.Destroy ();
					}, [27]);

					// ------
					var scroll = q.el_body.getElementsByTagName('div')[0];
					scroll.addEventListener ('touchstart', function(e){
						e.stopPropagation ();
					}, false);
					scroll.addEventListener ('touchmove', function(e){
						e.stopPropagation ();
					}, false);

					// ------
				}
			});
			md.Show ();
			document.getElementsByClassName('pk_modal_cancel')[0].innerHTML = '&nbsp; &nbsp; &nbsp; OK &nbsp; &nbsp; &nbsp;';
	};

	var change = 96;
	var exists = w.localStorage && w.localStorage.getItem ('k');

	if (!exists) {
		change = 0;
		w.localStorage && w.localStorage.setItem ('k', 1);
	}

	if ( ((Math.random () * 100) >> 0) < change) return ;
	PKAudioEditor._deps.Wlc ();

}, 320);

})( window, document, PKAudioEditor );