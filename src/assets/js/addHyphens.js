addHyphens = function(input, data, pasted){    

    var format_and_pos = function(char, backspace)
    {
        var start = 0;
        var end = 0;
        var pos = 0;
        var separator = "-";
        var value = pasted ? input.value : input.value.slice(0, -1);

        if (char !== false)
        {
            start = input.selectionStart;
            end = input.selectionEnd;

            if (backspace && start > 0)
            {
                start--;

                if (value[start] == separator)
                { start--; }
            }
            value = value.substring(0, start) + char + value.substring(end);

            pos = start + char.length;
        }

        var d = 0;
        var gi = 0;
        var newV = "";
        var groups = [8, 4, 4, 4, 12];

        for (var i = 0; i < value.length; i++)
        {
            if (/\W/.test(value[i]))
            {
                if (start > i)
                { pos--; }
            }
            else
            {
                if (d === groups[gi])
                {
                    newV += separator;
                    d = 0;
                    gi++;

                    if (start >= i)
                    { pos++; }
                }
                newV += value[i];
                d++;
            }
            if (d === groups[gi] && groups.length === gi + 1)
            { break; }
        }
        input.value = newV;

        if (char !== false)
        { input.setSelectionRange(pos, pos); }
    };

    if (pasted){
        setTimeout(function(){ format_and_pos(''); }, 50);
    }else{
        if (/\W/.test(data) || (input.selectionStart === input.selectionEnd &&
            input.value.replace(/\W/g, '').length > 32))
            {
                return false;
            }
    
        format_and_pos(data);
    }
}