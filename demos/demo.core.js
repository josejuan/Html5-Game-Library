/*
 * -- JJBM, 25/01/2012, demo.core.js
 * --/
 */

// simple demo rollover
var demos = {

    nDemos: 0,    // total demos attached
    curDemo: 0,   // current playing demo

    // to attach a demo, simply call with a controller argument
    AttachDemo: function (controller) {
        var n = this.nDemos++;
        controller.demo.nDemo = n;
        this['demo' + n] = controller;
    },

    SetCurrentDemo: function (workspace) {
        var n = this.curDemo;
        var k = 'demo' + n;
        var d = this[k];
        workspace.AttachController(k, d);
        var l = document.getElementById(k + 'layout');
        l.style.backgroundColor = '#e5fff0';
        l.scrollIntoView();
        document.getElementById('demolist').scrollIntoView();
    },

    UnsetCurrentDemo: function (workspace) {
        var k = 'demo' + this.curDemo;
        workspace.DetachController(k, this[k]);
        document.getElementById(k + 'layout').style.backgroundColor = 'white';
    },

    SetNextDemo: function (workspace) {
        this.SetDemo(workspace, this.curDemo + 1);
    },

    SetPriorDemo: function (workspace) {
        this.SetDemo(workspace, this.curDemo - 1);
    },

    SetDemo: function (workspace, n) {
        this.UnsetCurrentDemo(workspace);
        if(n < 0)
            n += this.nDemos * (1 - Math.ceil(n / this.nDemos));
        n %= this.nDemos;
        this.curDemo = n;
        this.SetCurrentDemo(workspace);
    },

    GenerateDemoList: function (template) {
        var r = "";
        var p = ['nDemo', 'title', 'description', 'sourcecode', 'thumbnail'];
        for (var n = 0, N = this.nDemos; n < N; n++) {
            var d = this['demo' + n].demo;
            var w = "" + template;
            for (var k = 0, K = p.length; k < K; k++)
                w = w.replace(eval('/(\\{|%7B)' + k + '(\\}|%7D)/gi'), d[p[k]]).replace('<imgtag', '<img');
            r += w;
        }
        return r;
    }

};
