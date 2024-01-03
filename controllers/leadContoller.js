const Lead = require('../models/Lead');

exports.applyLoan = async (req, res) => {
  const { name, email, number, salary, address, timeToReach, reachBy } = req.body;
  const leadType = req.params.type;
  try {
    const lead = await Lead.create({ name, email, number, salary, address, timeToReach, reachBy, leadType });
    res.status(201).send(`
  <html>
  <style>
  
@supports (animation: grow .5s cubic-bezier(.25, .25, .25, 1) forwards) {
  .tick {
     stroke-opacity: 0;
     stroke-dasharray: 29px;
     stroke-dashoffset: 29px;
     animation: draw .5s cubic-bezier(.25, .25, .25, 1) forwards;
     animation-delay: .6s
 }

 .circle {
     fill-opacity: 0;
     stroke: #219a00;
     stroke-width: 16px;
     transform-origin: center;
     transform: scale(0);
     animation: grow 1s cubic-bezier(.25, .25, .25, 1.25) forwards;   
 }   
}

@keyframes grow {
 60% {
     transform: scale(.8);
     stroke-width: 4px;
     fill-opacity: 0;
 }
 100% {
     transform: scale(.9);
     stroke-width: 8px;
     fill-opacity: 1;
     fill: #219a00;
 }
}

@keyframes draw {
 0%, 100% { stroke-opacity: 1; }
 100% { stroke-dashoffset: 0; }
}








// Styles
:root {
--theme-color: var(--color-purple);
}
*{
  margin:0;
 padding:0;
 box-sizing:border-box;
}
body{
 margin:0;
 padding:0;
 box-sizing:border-box;
 overflow:hidden;
 height: 100vh;
 width:100vw;
}
.svg-container{
 box-sizing:border-box;
 
 height: 100vh;
 width:100vw;
margin:0;
 padding:0;
 display: flex;
 flex-direction:column;
 justify-content: center;
 align-items: center;
}
  </style>
    <body>
    <div class="svg-container">    
    <svg class="ft-green-tick" xmlns="http://www.w3.org/2000/svg" height="100" width="100" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="circle" fill="#5bb543" cx="24" cy="24" r="22"/>
        <path class="tick" fill="none" stroke="#FFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M14 27l5.917 4.917L34 17"/>
    </svg>
    <p>Thanks Our Agent Will Contact You Shortly<p>
</div>
      <script>
        setTimeout(function(){
          window.location.href = '/';
        }, 2500);
      </script>
    </body>
  </html>
`);

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

