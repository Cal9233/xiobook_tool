let soc_sec_6_2_wh = (gross_wages_per_week) => gross_wages_per_week * 0.062;
let medicare_1_45 = (gross_wages_per_week) => gross_wages_per_week * 0.0145;
let sdi = (gross_wages_per_week) => gross_wages_per_week * 0.011;
let net_wage =  (gross_wages_per_week, fed_income_tax_wh, ca_pit_wh) =>
  gross_wages_per_week -
  fed_income_tax_wh -
  soc_sec_6_2_wh -
  medicare_1_45 -
  ca_pit_wh -
  sdi;