const Lead = require("../models/Lead");

exports.applyLoan = async (req, res) => {
  const {
    name,
    email,
    number,
    salary,
    address,
    companyName,
    timeToReach,
    reachBy,
    userId,
  } = req.body;
  const leadType = req.params.type;
  // const userId = req.user._id; // Get the user ID from the authenticated user


  // const pancard = req.files["pancard"][0].path; 
  // const salaryslip = req.files["salaryslip"][0].path; 
  // const companyid = req.files["companyid"][0].path; 
  // const passportSizePhoto = req.files["passportSizePhoto"][0].path; 
  // const bankStatement = req.files["bankStatement"][0].path; 
  // const offerLetter = req.files["offerLetter"][0].path; 
  // const ITR = req.files["ITR"][0].path; 
  // const companyBankStatement = req.files["companyBankStatement"][0].path; 
  // const companyAddressProof = req.files["companyAddressProof"][0].path; 

  // Create an object to hold the file paths
  const fileFields = {
    pancard: req.files["pancard"] ? req.files["pancard"][0].path : undefined,
    salaryslip: req.files["salaryslip"] ? req.files["salaryslip"][0].path : undefined,
    companyid: req.files["companyid"] ? req.files["companyid"][0].path : undefined,
    passportSizePhoto: req.files["passportSizePhoto"] ? req.files["passportSizePhoto"][0].path : undefined,
    bankStatement: req.files["bankStatement"] ? req.files["bankStatement"][0].path : undefined,
    offerLetter: req.files["offerLetter"] ? req.files["offerLetter"][0].path : undefined,
    ITR: req.files["ITR"] ? req.files["ITR"][0].path : undefined,
    companyBankStatement: req.files["companyBankStatement"] ? req.files["companyBankStatement"][0].path : undefined,
    companyAddressProof: req.files["companyAddressProof"] ? req.files["companyAddressProof"][0].path : undefined,
    companyPancard: req.files["companyPancard"] ? req.files["companyPancard"][0].path : undefined,
  };

  try {
    const lead = await Lead.create({
      name,
      email,
      number,
      salary,
      address,
      companyName,
      timeToReach,
      reachBy,
      leadType,
      userId, // Associate the lead with the user
      documents: fileFields,
    });
    res.status(201).send(`<html>
      <style>
      .lottie-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.lottie-container iframe {
  border: none;
  min-width: 100%;
  min-height: 100%;
}
      </style>
      <body>
      <div class="lottie-container">
  <iframe src="https://lottie.host/embed/d5630544-dfa8-4446-8267-03cbe4716a42/1kUQ9782wM.json"></iframe>
</div>
        <script>
          setTimeout(function(){
            window.location.href = '/';
          }, 2100);
        </script>
      </body>
    </html>`);
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

