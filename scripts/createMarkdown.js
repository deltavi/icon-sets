var imports = new JavaImporter(java.nio.file, java.io, java.util);
with (imports) {
    function writeReport(filename, text) {
        try {
            new File("out/").mkdirs();
            var fw = new FileWriter("out/" + filename, true);
            var bw = new BufferedWriter(fw);
            var out = new PrintWriter(bw);
            out.println(text);
            out.close();
            bw.close();
            fw.close();
        } catch (ex) {
            print("Error on " + filename + ": " + ex);
        }
    }

    var homeDir = new File("../flat-icons/png");
    var sizeMap = new HashMap();
    var outMap = new HashMap();
    var listHomeDir = homeDir.listFiles();

    for (var i in listHomeDir) {
        var file = listHomeDir[i];
        var fileList = file.listFiles();
        var size = file.name.split("x")[0];
        sizeMap.put(parseInt(size), file);
        for (var j in fileList) {
            var file2 = fileList[j];
            var fileNameWithoutSize = file2.getName().replace("." + file.name, "");
            if (!outMap.containsKey(fileNameWithoutSize)) {
                outMap.put(fileNameWithoutSize, new ArrayList());
            }
        }
    }

    var sortedSizes = new ArrayList(sizeMap.keySet());
    Collections.sort(sortedSizes);
    print(sortedSizes);

    var outputList = new ArrayList();
    for (var i in sortedSizes) {
        var file = sizeMap.get(sortedSizes[i]);
        var fileList = file.listFiles();
        for (var j in fileList) {
            var file2 = fileList[j];
            var fileNameWithoutSize = file2.getName().replace("." + file.name, "");
            outMap.get(fileNameWithoutSize).add(file2);
            if (sortedSizes[i] == "48") {
                var currentPath = Paths.get(homeDir.getPath()).getParent().getParent().relativize(Paths.get(file2.getPath())).toString();
                currentPath = currentPath.replaceAll("\\\\", "/");
                writeReport("48x48_Report.md", "![" + file2.getName() + "](" + currentPath + ")");
            }
        }
    }
    for (var key in outMap) {
        var fileList = outMap[key];
        for (var i in fileList) {
            var file = fileList[i];
            var currentPath = Paths.get(homeDir.getPath()).getParent().relativize(Paths.get(file.getPath())).toString();
            currentPath = currentPath.replaceAll("\\\\", "/");
            writeReport("fullReport.md", "![" + file.getName() + "](" + currentPath + ")");
        }
        writeReport("fullReport.md", "");
    }
}
