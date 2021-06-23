import Service from '@ember/service';

const LINE_DELIMITER = '\n';
const DATA_DELIMITER = ';';

export default Service.extend({

  makeContent(header, data) {
    let output = header.join(DATA_DELIMITER) + LINE_DELIMITER;

    data.forEach(line => {
      output += line.join(DATA_DELIMITER) + LINE_DELIMITER;
    });

    return output;
  },

  asCSV(fileName, header, data) {
    const content = this.makeContent(header, data);
    const { document, URL } = window;
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = URL.createObjectURL(new Blob([content], {
      type: 'text/csv'
    }));

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  },

  asTxt(fileName, content) {
    const { document, URL } = window;
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = URL.createObjectURL(new Blob([content], {
      type: 'text/txt'
    }));

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
});
