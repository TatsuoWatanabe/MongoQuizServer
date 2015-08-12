class Trace {

    public static log(message: any, title: string = 'Trace.log') {
        var separator = ' --- ' + title + ' --- ';

        console.log(separator);
        console.log(message);
        console.log(Array(separator.length).join('-'));
    }
}

export = Trace