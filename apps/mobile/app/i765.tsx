import { useMemo, useState } from "react";
import { Switch, Text, View } from "react-native";
import {
  DEFAULT_I765_FEE_CENTS,
  I765_FLAG_COPY,
  i765RejectFlags,
} from "@statuspass/compliance";
import { Card, Field, Notice, PrimaryButton, Screen } from "../src/ui";
import { tokens } from "../src/theme";

export default function I765Screen() {
  const fee = DEFAULT_I765_FEE_CENTS;
  const [category, setCategory] = useState("c03b");
  const [sevisId, setSevisId] = useState("");
  const [cipCode, setCipCode] = useState("");
  const [stemEligible, setStemEligible] = useState(false);
  const [signatureOk, setSignatureOk] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const flags = useMemo(
    () =>
      i765RejectFlags({
        category,
        sevisId,
        cipCode,
        stemEligible,
        signatureOk,
        filingFeeCents: fee,
        currentFeeCents: fee,
      }),
    [category, sevisId, cipCode, stemEligible, signatureOk, fee],
  );

  return (
    <Screen title="I-765 packet check">
      <Notice>
        Packet check only — not a USCIS filing. Current fee on file: $
        {(fee / 100).toFixed(2)}.
      </Notice>
      <Field
        label="Category (c03a / c03b / c03c / other)"
        value={category}
        autoCapitalize="none"
        onChangeText={setCategory}
      />
      <Field
        label="SEVIS ID"
        value={sevisId}
        autoCapitalize="characters"
        placeholder="N0000000000"
        onChangeText={(value) => setSevisId(value.toUpperCase())}
      />
      <Field
        label="CIP code"
        value={cipCode}
        placeholder="11.0701"
        onChangeText={setCipCode}
      />
      <Card>
        <Toggle
          label="STEM eligible (c03c)"
          value={stemEligible}
          onValueChange={setStemEligible}
        />
        <Toggle
          label="Signature / name matches"
          value={signatureOk}
          onValueChange={setSignatureOk}
        />
      </Card>
      <PrimaryButton
        label="Check packet"
        onPress={() => {
          setAttempted(true);
          setMessage(
            flags.length
              ? "Fix the chips under each field. This is not a USCIS filing."
              : "Packet looks complete enough to review with your DSO. StatusPass does not file Form I-765.",
          );
        }}
      />
      {attempted
        ? flags.map((flag) => (
            <Text key={flag} style={{ color: tokens.critical, fontWeight: "600" }}>
              {I765_FLAG_COPY[flag]}
            </Text>
          ))
        : null}
      {message ? <Text style={{ color: tokens.navy }}>{message}</Text> : null}
    </Screen>
  );
}

function Toggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: tokens.ink, flex: 1, paddingRight: 12 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
