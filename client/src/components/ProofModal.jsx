import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

const ProofModal = ({ isOpen, onClose, onSubmit }) => {
  const [proofType, setProofType] = useState("text");
  const [textProof, setTextProof] = useState("");
  const [fileProof, setFileProof] = useState(null);

  // Reset state when modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setTextProof("");
      setFileProof(null);
      setProofType("text");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("completed", "true");

    if (proofType === "text") {
      if (!textProof.trim()) return alert("Please enter proof details");
      formData.append("proofType", "text");
      formData.append("proof", textProof);
    } else {
      if (!fileProof) return alert("Please select a file");
      formData.append("proofType", proofType);
      formData.append("proof", fileProof);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Task</DialogTitle>
          <DialogDescription>
            Please provide proof of completion to finish this task.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="text"
          value={proofType}
          onValueChange={setProofType}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text / Letter</TabsTrigger>
            <TabsTrigger value="image">Image / Video</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proof-text">Proof Details</Label>
              <Textarea
                id="proof-text"
                placeholder="Enter approval letter content or details..."
                rows={4}
                value={textProof}
                onChange={(e) => setTextProof(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="proof-file">Upload Evidence</Label>
              <Input
                id="proof-file"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFileProof(e.target.files[0])}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload a photo or video evidence.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Proof</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProofModal;
