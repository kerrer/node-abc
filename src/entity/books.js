/* jshint ignore:start */
/**
 * 一本书有多个页面；有多个作者；一个作者又可以写多本书
 * 
*/
var Book = {
  tableName: 'books',
  pages: function() {
    return this.hasMany(Page);
  },
  authors: function() {
    return this.belongsToMany(Author);
  }
};

// 一对多
var Page = {
  tableName: 'pages',
  book: function() {
    return this.belongsTo(Book);
  }
};

//多对多
var Author = {
  tableName: 'authors',
  books: function() {
    return this.belongsToMany(Book);
  }
};
