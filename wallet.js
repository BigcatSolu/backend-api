const wallet = async (phoneNumber = "", voucherCode = "") => {
    phoneNumber = phoneNumber.trim();
    if (!phoneNumber.length || phoneNumber.match(/\D/)) {
      throw new Error("INVALID_PHONE");
    }
  
    let parts = voucherCode.split("v=");
    voucherCode = (parts[1] || parts[0]).match(/[0-9A-Za-z]+/)[0];
    if (voucherCode.length !== 35) {
      throw new Error("INVALID_VOUCHER");
    }
  
    let response = await fetch(`https://gift.truemoney.com/campaign/vouchers/${voucherCode}/redeem`, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        mobile: phoneNumber,
        voucher_hash: voucherCode
      })
    }).then(response => response.json());
  
    if (response.status.code === "SUCCESS") {
      return {
        amount: Number(response.data.my_ticket.amount_baht.replace(/,/g, '')),
        owner_full_name: response.data.owner_profile.full_name,
        code: voucherCode,
      };
    } else {
      throw new Error(response.status.code);
    }
  };
  export default wallet