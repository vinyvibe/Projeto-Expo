import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Animated } from 'react-native';

export default function App(){

	const [parc1, setParc1] = useState("");
	const [parc2, setParc2] = useState("");
	const [somaR, setSomarR] = useState("clique aqui para Multiplicar");
	const [erro, setErro] = useState("");
	const [statusParc1, setStatusParc1] = useState("normal"); // normal, sucesso, erro
	const [statusParc2, setStatusParc2] = useState("normal");
	
	// Referências para animação
	const scaleAnim1 = useRef(new Animated.Value(1)).current;
	const scaleAnim2 = useRef(new Animated.Value(1)).current;
	
	// Animação para mensagem de erro
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (erro !== "") {
			Animated.sequence([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.delay(2000),
				Animated.timing(fadeAnim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				})
			]).start();
		}
	}, [erro]);

	function handleFocus(scaleAnim) {
		Animated.spring(scaleAnim, {
			toValue: 1.05,
			friction: 3,
			tension: 40,
			useNativeDriver: true,
		}).start();
	}

	function handleBlur(scaleAnim) {
		Animated.spring(scaleAnim, {
			toValue: 1,
			friction: 3,
			tension: 40,
			useNativeDriver: true,
		}).start();
	}

	function handleChangeText(text, input) {
		if (input === 'parc1') {
			setParc1(text);
			setStatusParc1("normal"); // Reseta status ao digitar
		} else {
			setParc2(text);
			setStatusParc2("normal");
		}
		setErro("");
	}

	function executarSoma(){
		setErro("");
		
		// Validação de campos vazios
		if (parc1.trim() === "" || parc2.trim() === "") {
			setErro("⚠️ Preencha ambos os números!");
			setSomarR("clique aqui para somar");
			
			if (parc1.trim() === "") {
				setStatusParc1("erro");
				animateShake(scaleAnim1);
			}
			if (parc2.trim() === "") {
				setStatusParc2("erro");
				animateShake(scaleAnim2);
			}
			return;
		}
		
		let p1 = parseInt(parc1);
		let p2 = parseInt(parc2);
		
		// Validação de números válidos
		if (isNaN(p1) || isNaN(p2)) {
			setErro("❌ Digite números válidos!");
			setSomarR("clique aqui para somar");
			setStatusParc1("erro");
			setStatusParc2("erro");
			animateShake(scaleAnim1);
			animateShake(scaleAnim2);
			return;
		}
		
		// Se passou nas validações, mostra sucesso
		let resultado = p1 + " × " + p2 + " = " + (p1 * p2);
		setSomarR(resultado);
		setErro("✓ Cálculo realizado com sucesso!");
		setStatusParc1("sucesso");
		setStatusParc2("sucesso");
		
		// Reseta as bordas verdes após 2 segundos
		setTimeout(() => {
			setStatusParc1("normal");
			setStatusParc2("normal");
		}, 2000);
	}

	function animateShake(scaleAnim) {
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 1.1,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			})
		]).start();
	}

	// Função para definir o estilo da borda baseado no status
	const getInputStyle = (status) => {
		switch(status) {
			case "sucesso":
				return styles.entradaSucesso;
			case "erro":
				return styles.entradaErro;
			default:
				return styles.entrada;
		}
	};

	return(
		<View style={styles.container}>
			<Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
				<TextInput 
					style={getInputStyle(statusParc1)}
					value={parc1} 
					onChangeText={(text) => handleChangeText(text, 'parc1')}
					keyboardType="numeric"
					onFocus={() => handleFocus(scaleAnim1)}
					onBlur={() => handleBlur(scaleAnim1)}
					placeholder="Primeiro número"
				/>
			</Animated.View>
			
			<Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
				<TextInput 
					style={getInputStyle(statusParc2)}
					value={parc2} 
					onChangeText={(text) => handleChangeText(text, 'parc2')}
					keyboardType="numeric"
					onFocus={() => handleFocus(scaleAnim2)}
					onBlur={() => handleBlur(scaleAnim2)}
					placeholder="Segundo número"
				/>
			</Animated.View>
			
			{erro !== "" && (
				<Animated.Text 
					style={[
						styles.mensagemErro,
						erro.includes("✓") && styles.mensagemSucesso,
						{ opacity: fadeAnim }
					]}
				>
					{erro}
				</Animated.Text>
			)}
			
			<TouchableOpacity onPress={executarSoma}>
				<Text style={styles.texto}>{somaR}</Text>
			</TouchableOpacity>
		</View>
		
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  texto: {
    fontFamily: "Verdana",
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',     
  },
  entrada: {
    width: '100%',            
    borderWidth: 2,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  entradaSucesso: {
    width: '100%',            
    borderWidth: 3,
    borderColor: '#4CAF50',  // Verde
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#f0fff0', // Fundo verde claro
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 15,
  },
  entradaErro: {
    width: '100%',            
    borderWidth: 3,
    borderColor: '#ff4444',  // Vermelho
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff0f0', // Fundo vermelho claro
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 15,
  },
  mensagemErro: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: "Verdana",
    paddingHorizontal: 20,
  },
  mensagemSucesso: {
    color: '#4CAF50',
  }
});