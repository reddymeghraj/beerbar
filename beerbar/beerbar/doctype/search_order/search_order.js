cur_frm.cscript.order_id=function(doc,cdt,cdn)
{
	var order_id=doc.order_id;
	frappe.call({
		method:'beerbar.beerbar.doctype.search_order.search_order.get_order_details',
		args:{o:order_id},
		callback:function(r)
		{
			set_field_options('test',r.message)
		}
	})
}