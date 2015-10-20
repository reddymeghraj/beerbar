cur_frm.cscript.onload=function(doc,cdt,cdn)
{
	var g_order_id;
	Date.prototype.yyyymmdd = function() 
	{
   	var yyyy = this.getFullYear().toString();
  	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   	var dd  = this.getDate().toString();
   	return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]); // padding
  	};

	d = new Date();
	m=d.yyyymmdd();
	doc.date=m
	frappe.call({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.show_table',
		args:{d:m},
		callback:function(r)
		{
			var doclist=frappe.model.sync(r.message)
			set_field_options('test',doclist[0])
			g_tables=doclist[1]
			cur_frm.set_value('waiter_name',doclist[2])
		}
	})
	frappe.call({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.get_item',
		args:{},
		callback:function(r)
		{
			set_field_options('item',r.message)	
		}
	})
	frappe.call({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.get_type',
		args:{},
		callback:function(r)
		{
			set_field_options('btype',r.message)	
		}
	})
}
var gtotal_amt;
cur_frm.cscript.add_item=function(doc,cdt,cdn)
{
	var o_id=doc.order_id;
	var item=doc.item;
	var type=doc.btype;
	var qty=doc.quantity;
	var rate1=doc.rate;
	var d=doc.date;
	var t=doc.table_no;
	var w=doc.waiter_name;
	var o_sts=doc.order_status
	var ml_pack=doc.qty_pack;
	var packs=doc.no_of_packs;
	var rate_pack=doc.rate_pack;
	var room=doc.select_room
	var customer=doc.customer_name;
	if(doc.is_lodge_client=='')
	{
		alert('Is Lodge Client field can not be blank');
	}
	frappe.call({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.insert_item',
		args:{o:o_id,i:item,t:type,q:qty,r:rate1,d:d,tbl:t,w:w,o_sts:o_sts,ml_pack:ml_pack,packs:packs,rate_pack:rate_pack,room:room,customer:customer},
		callback:function(r)
		{
			set_field_options('test1',r.message);
		}
	})
	cur_frm.set_value('qty_pack','');
	cur_frm.set_value('no_of_packs','');
	cur_frm.set_value('rate_pack',0);
	cur_frm.set_value('item','');
	cur_frm.set_value('btype','');
	cur_frm.set_value('quantity','');
	cur_frm.set_value('available_stock','');
	cur_frm.set_value('rate','');
}
cur_frm.cscript.item=function(doc,cdt,cdn)
{
	var item=doc.item
	
	frappe.call
	({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.toggle_type',
		args:{i:item},
		callback:function(r)
		{
			if(r.message!=null)
			{
				cur_frm.set_value('btype','')
				cur_frm.set_value('available_stock','')
				//cur_frm.set_value('qty_pack','')
				//cur_frm.set_value('no_of_packs','')
				///cur_frm.set_value('rate_pack','')
				frappe.call
				({
					method:'beerbar.beerbar.doctype.order_generation.order_generation.is_brand',
					args:{i:item},
					callback:function(r)
					{
						cur_frm.toggle_enable('btype')
						cur_frm.toggle_enable('qty_pack')
						cur_frm.toggle_enable('no_of_packs')
						cur_frm.toggle_enable('rate_pack')
						cur_frm.set_value('rate',r.message)
						cur_frm.set_value('btype','')
						cur_frm.set_value('available_stock','')
					}
				})
			}
			else
			{
				cur_frm.toggle_enable("btype",true)
				cur_frm.toggle_enable('qty_pack',true)
				cur_frm.toggle_enable('no_of_packs',true)
				cur_frm.toggle_enable('rate_pack',true)
				cur_frm.toggle_enable('quantity',true)
				cur_frm.cscript.btype=function(doc,cdt,cdn)
				{
					var type=doc.btype
					frappe.call
					({
						method:'beerbar.beerbar.doctype.order_generation.order_generation.get_rate',
						args:{b:item,t:type},
						callback:function(r)
						{
							var doclist=frappe.model.sync(r.message)
							cur_frm.set_value('available_stock',doclist[0])
							cur_frm.set_value('rate',doclist[1])
							cur_frm.set_value('in_ml',doclist[2])
						}
					})

				}
			}
		}
	})
}
cur_frm.cscript.submit_list=function(doc,cdt,cdn)
{
	var d=doc.date;
	var t=doc.table_no;
	var w=doc.waiter_name;
	var o=doc.order_id;
	var o_sts=doc.order_status;
	frappe.call
	({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.record_submission',
		args:{d:d,t:t,w:w,o:o,o_sts:o_sts},
		callback:function()
		{
			cur_frm.set_value('order_status','Completed')
		}
	})
}
cur_frm.cscript.quantity=function(doc,cdt,cdn)
{

	if(doc.quantity==0)
	{
		
		cur_frm.toggle_enable('qty_pack',true);
		cur_frm.toggle_enable('no_of_packs',true);
		cur_frm.toggle_enable('rate_pack',true)
		cur_frm.cscript.qty_pack=function(doc,cdt,cdn)
		{
		if(doc.qty_pack!=0)
		{
			cur_frm.toggle_enable('quantity');
			cur_frm.set_value('quantity',0)
			var t=parseInt(doc.btype);
			var r=parseInt(doc.rate);
			var x=(r/t);
			var y=doc.qty_pack;
			var w=parseInt(x*y);
			cur_frm.set_value('rate_pack',w);
		}
	}
	}	
	else
	{
		cur_frm.toggle_enable('qty_pack');
		cur_frm.toggle_enable('no_of_packs');
		cur_frm.toggle_enable('rate_pack');
		cur_frm.set_value('qty_pack',0)
		cur_frm.set_value('no_of_packs',0)
		cur_frm.set_value('rate_pack',0)
	}	
}

cur_frm.cscript.qty_pack=function(doc,cdt,cdn)
{	
	if(doc.qty_pack!=null && doc.quantity==null)
	{	
		cur_frm.toggle_enable('quantity');
		cur_frm.set_value('quantity',0)
		var t=parseInt(doc.btype);
		var r=parseInt(doc.rate);
		var x=(r/t);
		var y=doc.qty_pack;
		var w=parseInt(x*y);
		cur_frm.set_value('rate_pack',w);
	}
	else
	{
		cur_frm.toggle_enable('quantity',true)
	}

}
cur_frm.cscript.print_bill=function(doc,cdt,cdn)
{
  
  var d=doc.date;
  var tbl=doc.table_no;
  var wtr=doc.waiter_name;
  var order_id=doc.order_id
  frappe.call({
  	method:'beerbar.beerbar.doctype.order_generation.order_generation.get_div',
  	args:{d:d,tbl:tbl,wtr:wtr,order_id:order_id},
  	callback:function(r)
  	{
  		var doclist=frappe.model.sync(r.message);
  		set_field_options('test1',doclist[0]);
  		var length1=doclist[1];
  		var divToPrint1=document.getElementById('d1');
        var col =1;
        if (isNaN(col) || col == "") 
        	{
        		alert("Invalid Column");
                return;
            }
        col = parseInt(col, 10);
        col = col - 1;
        var tbl = document.getElementById("Tbl1");
         if (tbl != null) 
         {
         	if (col < 0 || col >= tbl.rows.length - 1) 
         	{
			   alert("Invalid Column");
               return;
            }
        	for (var i = 0; i < tbl.rows.length; i++) 
        	{
        		 for (var j = 0; j < tbl.rows[i].cells.length; j++) 
        		 {
                    tbl.rows[i].cells[j].style.display = "";
                     if (j == col)
                     tbl.rows[i].cells[j].style.display = "none";
                  }
            }

         }
  		newWin= window.open("");
  		//newWin.document.write(divToPrint.outerHTML);
  		newWin.document.write(divToPrint1.outerHTML);
 		newWin.print();
  		newWin.close();
 	}
 	
  })
  
}
cur_frm.cscript.is_lodge_client=function(doc,cdt,cdn)
{
	if(doc.is_lodge_client=='No')
	{
		cur_frm.toggle_enable('select_room');
		cur_frm.set_value('select_room',0);
		cur_frm.set_value('customer_name',0);
	}
	else
	{
		cur_frm.toggle_enable('select_room',true);
		cur_frm.set_value('customer_name','');
		frappe.call({
			method:'beerbar.beerbar.doctype.order_generation.order_generation.get_room',
			args:{},
			callback:function(r)
			{
				set_field_options('select_room',r.message)
				cur_frm.cscript.select_room=function(doc,cdt,cdn)
				{
					var room=doc.select_room;
					frappe.call
					({
						method:'beerbar.beerbar.doctype.order_generation.order_generation.get_customer',
						args:{room:room},
						callback:function(r)
						{
							if(r.message==null)
							{
								cur_frm.set_value('customer_name',0);
							}
							else
							{
								cur_frm.set_value('customer_name',r.message);
							}
						}
					})
				}
			}
		})
	}
}

/*cur_frm.cscript.show_tables=function(doc,cdt,cdn)
{
	

	Date.prototype.yyyymmdd = function() 
	{
   	var yyyy = this.getFullYear().toString();
  	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   	var dd  = this.getDate().toString();
   	return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]); // padding
  	};

	d = new Date();
	m=d.yyyymmdd();
	doc.date=m
	frappe.call({
		method:'beerbar.beerbar.doctype.order_generation.order_generation.show_table',
		args:{d:m},
		callback:function(r)
		{
			var doclist=frappe.model.sync(r.message)
			set_field_options('test',doclist[0])
			g_tables=doclist[1]
			cur_frm.set_value('waiter_name',doclist[2])
		}
	})

}*/

/*cur_frm.cscript.brand=function(doc,cdt,cdn)
{
	var d=locals[cdt][cdn];
	frappe.call({
		method:"beerbar.beerbar.doctype.order_generation.order_generation.get_brand_name",
		args:{bname:d.brand},
		callback:function(r)
		{
			d.brand_name=r.message;
			refresh_field("sellinfo");
		}
	}) 
}*/

//Get Type Name
/*cur_frm.cscript.brand_type=function(doc,cdt,cdn)
{
	var e=locals[cdt][cdn];
	frappe.call({
		method:"beerbar.beerbar.doctype.order_generation.order_generation.get_brand_type",
		args:{
			btype:e.brand_type,bname:e.brand_name,b:e.brand},
		callback:function(result)
		{
			var doclist=frappe.model.sync(result.message);
			if(doclist[0]=='')
			{
				e.available_stock='';
				refresh_field("loose_sellinfo");
			}
			else
			{
				e.available_stock=doclist[0];
			}
			//e.available_stock=doclist[0];
			e.type_name=doclist[1];
			e.rate=doclist[2];
			refresh_field("sellinfo");
		}
	})
}*/

/*cur_frm.cscript.quantity=function(doc,cdt,cdn)
{
	var e=locals[cdt][cdn];
	var q=e.quantity;
	var r=e.rate;
	var amt=q*r
	e.amount=amt;
	refresh_field("sellinfo");
	refresh_field('add_item');
}*/

/*cur_frm.cscript.item= function(doc,cdt,cdn)
{
	var d=locals[cdt][cdn];
	var item=d.item;
	frappe.call({
		method:'hotel.hotel.doctype.sale.sale.get_detail',
		args:{ item1:item },
		callback:function(r)
		{
			var doclist=frappe.model.sync(r.message);
			d.item_name1=doclist[0][0];
			d.rate=doclist[0][1];
			refresh_field('add_item');
		}
	});
}*/

/*cur_frm.cscript.quantity=function(doc,cdt,cdn)
{
	var item=doc.item
	var type=doc.btype
	
	if(!type)
	{
		
		/*frappe.call({
			method:'beerbar.beerbar.doctype.order_generation.order_generation.is_brand',
			args:{i:item},
			callback:function(r)
			{
				if(r.message==null)
				{
					cur_frm.toggle_enable('btype',true)
				
				}
				else
				{
					cur_frm.toggle_enable('btype')
					cur_frm.set_value('rate',r.message)
					cur_frm.set_value('btype','')
					cur_frm.set_value('available_stock','')
				}
			}
		})
	}
	else
	{
		/*frappe.call
		({
			method:'beerbar.beerbar.doctype.order_generation.order_generation.get_rate',
			args:{b:item,t:type},
			callback:function(r)
			{
				var doclist=frappe.model.sync(r.message)
				cur_frm.set_value('available_stock',doclist[0])
				cur_frm.set_value('rate',doclist[1])
			}
		})
	}
}*/
