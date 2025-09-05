type UploadProofOfPaymentArgs = {
  file: string; // blob string
  projectName: string;
  userId: string; // clerk user id
  dueDate: string; // like Oct 15, 2025
  contributor: string;
};

export async function uploadProofOfPayment(args: UploadProofOfPaymentArgs) {
  const response = await fetch("/api/upload-proof-of-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    return { error: true, url: null };
  }

  const result = await response.json();

  if (!result.url) {
    return { error: false, url: null };
  }

  return { error: false, url: result.url as string };
}
