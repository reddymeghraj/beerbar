
var table_length;
var waiter_length;
var wtr_list;
var table_list;
cur_frm.cscript.date=function(doc,cdt,cdn)
{
	var date=doc.date
	var d1=date.split("-")
	var y=d1[0]
	var m=d1[1]
	var day=d1[2]
	var today=new Date();
	var current_year=today.getFullYear()
	g_day=day;

	frappe.call({
		method:'beerbar.beerbar.doctype.assign_tables.assign_tables.get_list',
		args:{d:day},
		callback:function(r)
		{
			var doclist=frappe.model.sync(r.message)
			set_field_options('test',doclist[0])
			table_length=doclist[1]
			waiter_length=doclist[2]
			wtr_list=doclist[3]
			table_list=doclist[4]
		}
	})

	unhide_field('assign_tables')
	unhide_field('current_date') //unhiding section
	//Get Table Assign Details of previous date

	if((current_year>=y))
	{	
			frappe.call({
			method:'beerbar.beerbar.doctype.assign_tables.assign_tables.get_previous_data',
			args:{date:date},
			callback:function(r)
			{
				if(r.message!=null)
				{
					hide_field('assign_tables')
					hide_field('current_date') //unhiding section
				}
				else
				{
					unhide_field('assign_tables')
					unhide_field('current_date') //hiding section
				}
				var wtr=frappe.model.sync(wtr_list)
				var tbl=frappe.model.sync(table_list)
				var doclist1=frappe.model.sync(r.message)
				for(i=0;i<40;i++)
				{
					for(j=0;j<waiter_length;j++)
					{
						if(doclist1[i][0]==wtr[j])
						{
						for(k=0;k<40;k++)
							{
							if(doclist1[i][1]==tbl[k])
							document.getElementById("c"+j+"."+k).checked=true;
							}
						}
					}
				}
			}
		})
	}

}
function daysInMonth(month, year) 
{
    return new Date(year, month, 0).getDate();
}
cur_frm.cscript.assign_table=function(doc,cdt,cdn)
{
	hide_field('current_date');
	var date=doc.date;
	var d1=date.split("-");
	var y=parseInt(d1[0]);
	var m=parseInt(d1[1]);
	var day=parseInt(d1[2]);
	var days_in_month=daysInMonth(m,y);
	var wtr=frappe.model.sync(wtr_list);
	var tbl=frappe.model.sync(table_list);
	var date=doc.date;
	var mnth=parseInt(days_in_month)-parseInt(day);
	for (i=0; i<waiter_length; i++)
	{
		for (j=0; j<table_length; j++)
		{
			if(document.getElementById("c"+i+"."+j).checked==true)
			{
				wtr_name=wtr[i];
				tbl_name=tbl[j];
				frappe.call({
					method:'beerbar.beerbar.doctype.assign_tables.assign_tables.put_month_data',
					args:{d:date,w:wtr_name,t:tbl_name,mnth:mnth,y:y,m:m,day:day,days_in_month:days_in_month},
					callback:function()
					{

					}
				})
			}

		}	
		
	}
}

cur_frm.cscript.current_date=function(doc,cdt,cdn)
{
	hide_field('assign_table');
	var wtr=frappe.model.sync(wtr_list);
	var tbl=frappe.model.sync(table_list);
	var date=doc.date;
	for (i=0; i<waiter_length; i++)
	{
		for (j=0; j<table_length; j++)
		{
			if(document.getElementById("c"+i+"."+j).checked==true)
			{
				wtr_name=wtr[i];
				tbl_name=tbl[j];
				frappe.call({
					method:'beerbar.beerbar.doctype.assign_tables.assign_tables.put_data',
					args:{d:date,w:wtr_name,t:tbl_name},
					callback:function()
					{

					}
				})
			}

		}	
		
	}
}