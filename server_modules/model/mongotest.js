var ParentSchema = new Schema({
//    children:[{ type:Schema.ObjectId, ref:"Child" }]
});
Parent = mongoose.model("Parent", ParentSchema);
 
var ChildSchema = new Schema({
    parent: { type:Schema.ObjectId, ref:"Parent", childPath:"children" }
});
ChildSchema.plugin(relationship, { relationshipPathName:'parent' });
Child = mongoose.model("Child", ChildSchema);

