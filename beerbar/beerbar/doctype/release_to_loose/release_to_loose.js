cur_frm.cscript.quantity=function(doc,cdt,cdn)
{
	var qty=doc.quantity;
	var type=doc.type_name;
	var q=type*qty;
	cur_frm.set_value('total_qty',q)
}
cur_frm.cscript.brand_type= function(doc,cdt,cdn)
{
	var brand1=doc.brand;
	var brand_type1=doc.brand_type;
	frappe.call({
		method:"beerbar.beerbar.doctype.release_to_loose.release_to_loose.get_stock",
		args:{brand:brand1,brand_type:brand_type1},
		callback:function(r)
		{
			cur_frm.set_value("available_stock",r.message);
		}
	})
}