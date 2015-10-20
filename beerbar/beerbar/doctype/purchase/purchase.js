
cur_frm.cscript.rate= function(doc,cdt,cdn)
{
	var d=locals[cdt][cdn];
	var qty=d.quantity;
	var rate=d.rate;
	var amt=(qty*rate)
	d.amount=amt;
	refresh_field("purchaseinfo")
}
cur_frm.cscript.brand=function(doc,cdt,cdn)
{
	var d=locals[cdt][cdn];
	frappe.call({
		method:"beerbar.beerbar.doctype.purchase.purchase.get_brand_name",
		args:{bname:d.brand},
		callback:function(r)
		{
			d.brand_name=r.message;
			refresh_field("purchaseinfo");
		}
	}) 
}
cur_frm.cscript.brand_type=function(dco,cdt,cdn)
{
	var d=locals[cdt][cdn];
	frappe.call({
		method:'beerbar.beerbar.doctype.purchase.purchase.get_brand_type',
		args:{btype:d.brand_type},
		callback:function(r)
		{
			d.type_name=r.message;
			refresh_field("purchaseinfo");
		}
	})
}
cur_frm.cscript.bill=function(doc,cdt,cdn)
{
	var m=doc.purchaseinfo;
	var len=m.length;
	var amt=0;
	for(i=0;i<len;i++)
	{
		amt=amt+m[i].amount;
	}
	cur_frm.set_value('net_pay',amt);
	frappe.call({
		method:'beerbar.beerbar.doctype.purchase.purchase.get_money_in_words',
		args:{n:amt},
		callback:function(r)
		{
			cur_frm.set_value('net_pay_in_words',r.message)
		}
	})
}