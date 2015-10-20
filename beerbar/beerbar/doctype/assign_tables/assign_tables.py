# Copyright (c) 2013, wayzon and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import datetime

class AssignTables(Document):
	def validate(self):
		d=self.date
		q7=frappe.db.sql("""select date from `tabAssign Tables` where date=%s""",(d))
		if q7:
			frappe.throw("Entry already exists for selected date")
	def on_trash(self):
		dt=self.date
		q7=frappe.db.sql("""delete from `tabAssignTableData` where date=%s""",(dt))
@frappe.whitelist()
def get_list(d):
	q1=frappe.db.sql("""select waiter_name from `tabWaiter`""")
	l1=len(q1)	#Waiter Length
	#Head
	m_head="""
	<table border=5 id="Tbl1">
	<tr bgcolor=LightGreen align=center><td width=100 ><b>Waiter</td>"""
	q=frappe.db.sql("""select table_no from `tabTable`""")
	l=len(q)	#Table Length
	head1=''
	list1=[]
	for i in range( 0, l):
		dict={'Table No':q[i][0]}
		head2="""<td width=65><b>%s</td>""" %(dict['Table No'])
		"""</tr>""" 
		head1=head1+head2
		list1.append(q[i][0])	#table list
	head=m_head+head1
	d1=int(d)
	list=[]
	d2=''
	for k in range(0, l1):
		dict={'Waiter Name':q1[k][0]}
		a=''
		c="""
		<script>
		function myfunct(x)
		{
			var r = document.getElementById("Tbl1").rows;
			var length = r.length
			for (var i=0;i<length-1;i++)
			{
			var f=x.split(".")
			var g=f[1]
			var a=x[0]
			var b=x[1]
			var c=x[2]
			var d=x[3]
			var e=a+i+c+g
			document.getElementById(e).checked=false
			}
			document.getElementById(x).checked=true
		}
		</script>
		<tr align=center><td id="W%s">%s</td>""" %(k,dict['Waiter Name'])
		for m in range(0, l):
			b="""
			<td><input type="checkbox" id="c%s.%s" 
			onclick=myfunct(this.id)
			></td>""" %(k,m)
			a=a+b
		d=(c+a)
		d2=d2+d
		list.append(q1[k][0])	#waiter list
	table=head+d2
	return (table,l,l1,list,list1)
@frappe.whitelist()
def put_month_data(d,w,t,mnth,m,y,day,days_in_month):
	q6=frappe.db.sql("""select date from `tabAssign Tables` where date=%s""",(d))
	if q6:
		a=0;#unwanted but must
		frappe.throw("Entry already exists for selected date")
	else:
		for i in range(int(day), int(days_in_month)+1):
   			dte=datetime.date(int(y),int(m),i)
			q3=frappe.db.sql("""select max(cast(name as int)) from `tabAssignTableData`""")[0][0]
			if q3:
				name=int(q3)+1
			else:
				name=1
			q4=frappe.db.sql("""insert into `tabAssignTableData` set name=%s, date=%s,waiter=%s, table_no=%s""",(name,dte,w,t))
@frappe.whitelist()
def get_previous_data(date):
	q8=frappe.db.sql("""select waiter,table_no from `tabAssignTableData` where date=%s""",(date))
	if q8:
		return (q8)
	else:
		return (0)

@frappe.whitelist()
def put_data(d,w,t):
	q6=frappe.db.sql("""select date from `tabAssign Tables` where date=%s""",(d))
	if q6:
		a=0;#unwanted but must
		#frappe.throw("Entry already exists for selected date")
	else:
		q3=frappe.db.sql("""select max(cast(name as int)) from `tabAssignTableData`""")[0][0]
		if q3:
			name=int(q3)+1
		else:
			name=1
		q4=frappe.db.sql("""insert into `tabAssignTableData` set name=%s, date=%s,waiter=%s, table_no=%s""",(name,d,w,t))