from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Documents"),
			"icon": "icon-star",
			"items": [
				{
					"type": "doctype",
					"name": "Assign Tables",
					"description": _("Assign tables to waiters.")
				},
				{
					"type": "doctype",
					"name": "Order Generation",
					"description": _("Generate order table wise")
				},
				{
					"type": "doctype",
					"name": "Search order",
					"description": _("Details of each Order id.")
				},
				{
					"type": "doctype",
					"name": "Purchase",
					"description": _("Purchase Item")
				},
				{
					"type": "doctype",
					"name": "Release To Loose",
					"description": _("Loose Bottels.")
				},
				{
					"type": "doctype",
					"name": "Day Closing",
					"description": _("For Saving Stock at the end of day")
				},
				{
					"type": "doctype",
					"name": "Stock",
					"description": _("Main Stock Details.")
				},
				{
					"type": "doctype",
					"name": "Loose Stock",
					"description": _("Loose Stock Details.")
				},
				
			]
		},
		{
		"label":_("Standard Reports"),
		"icon": "icon-star",
		"items" : [
				{
					"type":"report",
					"name" :"Cash Sheet",
					"doctype": "Sale",
					"is_query_report": True,
				},
				{
					"type":"report",
					"name" :"Stock report",
					"doctype": "Sale",
					"is_query_report": True,
				},
		]
	}
	]