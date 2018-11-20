module.exports = class WikiPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;
  }


  _isPrivate() {
    return this.record && this.record.private;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == 2;  //2 represents admin priveledges
  }

  _isPremium(){
    return this.user && this.user.role == 1; //1 representsa premium member
  }

  _isStandard(){
    return this.user && this.user.role == 0; //0 reperesntas standard member
  }





  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return this.new();
  }


  edit() {
    return this.new() && this.record;
  }

  update() {
    return this.edit();
  }


  destroy() {
    return this.update();
  }
}
