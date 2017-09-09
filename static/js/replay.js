function getReplays() 
{
	var pos = 0;
	var data = "";
	var req = XMLHttpRequest ? new XMLHttpRequest() :
							   new ActiveXObject("Microsoft.XMLHTTP");
	var body = document.getElementsByName('body');
	req.onreadystatechange = function() 
	{
		var liveness = $("#replays-liveness");
		if (this.readyState > 2) 
		{
			var orig_sz = data.length;
			data       += this.responseText.substring(pos);
			pos         = this.responseText.length;
			var sep_pos = data.indexOf("\x1e", orig_sz);
			while (sep_pos != -1) 
			{
				if (sep_pos > 0) 
				{
					var msg = JSON.parse(data.substr(0, sep_pos));
					body.dispatchEvent(new CustomEvent('replay', msg));
				}

				data    = data.substr(sep_pos + 1);
				sep_pos = data.indexOf("\x1e");
			}
		}
		if (this.readyState == 4) 
		{
			req.abort();
			getReplays();
		}
	};
	req.open("GET", "https://dustkid.com/backend/events.php", true);
	req.send(null);
}

getReplays();